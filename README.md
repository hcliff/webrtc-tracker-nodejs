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

License
=====================

Copyright (c) 2013, Henry Clifford
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
* Neither the name of the <organization> nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


