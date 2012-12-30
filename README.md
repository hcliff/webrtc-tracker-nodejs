webrtc-tracker-nodejs
=====================

A webrtc compliant bittorrent tracker, written in nodejs

Installation
=====================

1. [Set up an amazon ec2 instance](https://github.com/hcliff/webrtc-tracker-nodejs/wiki/ec2) or similar (must support websockets).
2. SSH in, and run the following ```wget --no-check-certificate https://github.com/hcliff/webrtc-tracker-nodejs/blob/master/setup.sh && bash setup.sh```
3. done.

Notes
=====================
* Listens on port 80 by default, change this if you need

Why
=====================
* NodeJS chosen (over clojurescript) due to prevelance of the language and performance with websockets
* Socket.IO chosen as it allows compatability with non browser-based bitorrent clients (websockets is an interchangable transport layer). - This allows for desktop/mobile webrtc bitorrent clients.

Issues
=====================
* No flood protection or similar, *run this at your own risk*
* Doesn't use memcache, simply stores peers in a global variable
* Mostly a proof of concept, built for simplicity and use as reference
* *Doesn't use https* - User connection strings are sent cleartext, socket.io does support https/wss so this can be done.

Spec
=====================
[Read the wiki](http://github.com/hcliff/webrtc-tracker-nodejs/wiki)
