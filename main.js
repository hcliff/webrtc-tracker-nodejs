/**
 * Module dependencies.
 */

var express = require('express');

var sio = require('socket.io');
var _ = require('underscore');

/**
 * App.
 */

var app = express.createServer();

/**
 * Global vars
 */

var io = sio.listen(app);

var peers = {};

/**
 * Config vars
 */

maxNumwant = 20;
defaultNumwant = 10;
// remove this for an open tracker
allowedTorrents = null;

/**
 * Start reactor, listening for websocket events
 */

app.listen(80, () => {
  var addr = app.address();
  console.log('app listening on http://' + addr.address + ':' + addr.port);
});

/**
 * The meat
 */

io.sockets.on('connection', socket => {

    // The peer has started a new torrent
    socket.on('started', function (data) {

        if (!allowedTorrents ||
            (_.indexOf(allowedTorrents, data['info_hash']) !== -1)){

            // if no peers currently track this torrent create an entry
            if(! _.has(peers, data['info_hash']))
                peers[data['info_hash']] = {};

            // info on the peer
            peer = {
                numwant : _.min([data.numwant || 20, maxNumwant]),
                downloaded : data.downloaded || 0,
                uploaded : _.max([data.uploaded || 0, 0]),
                left : _.max([data.left || 0, 0]),
                socket : this,
            };

            // Add the peer to the list of torrent peers
            peers[data['info_hash']][data['peer_id']] = peer;

            // Remove the peer from the list on disconnect
            this.on('disconnect', () => {
                console.log('removing peer:'+data['peer_id']+' torrent:'+data['info_hash'])
                delete peers[data['info_hash']][data['peer_id']];
            });

            console.log('adding peer to torrent:'+data['info_hash']+' peer:'+data['peer_id'], peer)

         //     if(info_hash.length != 40 || peer_id.length < 20 || 
         //        peer_id.length > 50 || uploaded < 0 || 
         //        left < 0 || downloaded < 0) {
            //  console.log(info_hash)
            //  console.log(info_hash.length)
            //  error(response, "Invalid request"); return false;
            // }

            // get offers for this peer
            get_peers(data);

        }

    });

    // The peer (peer a) has provided an offer (for peer b)
    socket.on('offer', data => {

        console.log('making offer on torrent:'+data['info_hash']+' to peer:'+data['to_peer_id']);

        try{
            // check the peer b actually exists
            from_peer = peers[data['info_hash']][data['peer_id']];
            to_peer = peers[data['info_hash']][data['to_peer_id']];
            // does peer b still want peers
            if (to_peer.numwant > 0) {
                // send peer b the offer from peer a
                to_peer.socket.emit('offer', {
                    'sdp' : data['sdp'],
                    'info_hash' : data['info_hash'],
                    'peer_id' : data['peer_id']
                });
            }
        } catch(e){
            console.log('torrent or peer not found when making offer');
        }

    });

    // The peer (peer b) has provided an offer (for peer a)
    socket.on('answer', data => {

        try{
            // check the peers exist and have registered to this torrent
            from_peer = peers[data['info_hash']][data['peer_id']];
            to_peer = peers[data['info_hash']][data['to_peer_id']];
            // does peer a still want peers
            if (to_peer.numwant > 0) {
                // send peer a the answer from peer b
                to_peer.socket.emit('answer', {
                    'sdp' : data['sdp'],
                    'info_hash' : data['info_hash'],
                    'peer_id' : data['peer_id']
                });
                // we assume that an answer indicates the connections going to happen
                from_peer.numwant -= 1;
                to_peer.numwant -= 1;
            }
        } catch(e){
            console.log('torrent or peer not found when answering');
        }
    });

    // The peer (peer b) has provided an offer (for peer a)
    socket.on('ice-candidate', data => {

        try{
            // check the peers exist and have registered to this torrent
            from_peer = peers[data['info_hash']][data['peer_id']];
            to_peer = peers[data['info_hash']][data['to_peer_id']];
            
            to_peer.socket.emit('ice-candidate', {
                'candidate' : data['candidate'],
                'info_hash' : data['info_hash'],
                'peer_id' : data['peer_id']
            });
        } catch(e){
            console.log('torrent or peer not found when answering');
        }
    });

    // The peer needs more peers
    socket.on('need_peers', data => {
        try{
            peer = peers[data['info_hash']][data['peer_id']];
            get_peers(data);
        } catch(e){
            console.log('torrent or peer not found when grabbing peers');
        }
    });

});

var get_peers = data => {

    // Only use peers that still want peers
    numwant_filter = peer => peer.numwant > 0;
    // Don't send offer requests to yourself
    self_filter = (_, peer_id) => peer_id == data['peer_id']

    // randomly pick some peers
    return_peers = _.shuffle(
        _.filter(_.reject(peers[data['info_hash']], self_filter), numwant_filter)
    );

    // get a santised number of peers to get offers from
    numwant = data['numwant'] || maxNumwant;
    numwant = _.max([0, _.min([numwant, return_peers.length])]);

    // get the sockets for the peers we want
    return_sockets = _.pluck(return_peers.slice(0, numwant), 'socket');

    // loop through our randomly picked peers and request offers from them
    _.each(return_sockets, s => {
        // console.log('emit to ')
        s.emit('need_offer', {
            'peer_id' : data['peer_id'],
            'info_hash' : data['info_hash']
        });
    });
    
};