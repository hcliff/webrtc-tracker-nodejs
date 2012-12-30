#!/bin/sh
# http://catchvar.com/nodejs-server-and-web-sockets-on-amazon-ec2-w

sudo apt-get update
sudo apt-get install -y g++ curl libssl-dev apache2-utils
sudo apt-get install -y make
sudo apt-get install -y git-core

# Install node 

sudo git clone --depth 1 https://github.com/joyent/node.git
cd node
sudo git checkout v0.6.15
sudo ./configure --prefix=/usr
sudo make
sudo make install

# Install haproxy

cd ~
wget http://haproxy.1wt.eu/download/1.5/src/devel/haproxy-1.5-dev6.tar.gz
tar xzf haproxy-1.5-dev6.tar.gz
cd haproxy*
sudo make install

sudo mkdir /etc/haproxy
sudo sh -c 'cat > /etc/haproxy/haproxy.cfg << EOF
global
  maxconn 4096
 
defaults
  mode http
  
frontend all 0.0.0.0:80
  timeout client 86400000
  default_backend www_nodejs
  acl is_websocket hdr(upgrade) -i websocket
  acl is_websocket hdr_beg(host) -i ws
  
  use_backend www_nodejs if is_websocket
  
backend www_nodejs
  option forwardfor
  timeout server 86400000
  timeout connect 4000
  server nodejs 127.0.0.1:3000 weight 1 maxconn 10000 check
 
EOF'
 
# Test haproxy config
haproxy -c -f /etc/haproxy/haproxy.cfg

# Install Upstart
sudo apt-get install -y upstart
 
sudo sh -c 'cat > /etc/init/nodeServer.conf << EOF
#!upstart
description "node.js server"
author      "jsermeno"
 
start on startup
stop on shutdown
 
script
    export HOME="/root"
    
    NODE_ENV=production node /root/www/webrtc-tracker-nodejs/main.js 2>&1 >> /var/log/node.log
end script
EOF'
 
sudo chmod +x /etc/init/nodeServer.conf

# Install Monit
sudo apt-get install -y monit
 
sudo sh -c 'cat > /etc/monit/monitrc << EOF
#!monit
set logfile /var/log/monit.log
 
check host nodejs with address 127.0.0.1
    start program = "/sbin/start nodeServer"
    stop program  = "/sbin/stop nodeServer"
    if failed port 3000 protocol HTTP
        request /
        with timeout 10 seconds
        then restart
EOF'

# Get the tracker
mkdir ~/www
cd ~/www
sudo git clone git://github.com/hcliff/webrtc-tracker-nodejs.git
cd webrtc-tracker-nodejs

sudo npm install
sudo start nodeServer
