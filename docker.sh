#!/bin/bash

echo "Backend: clear NPM cache"
rm /tmp/* -R -f

echo "Backend: installing node modules"
cd /usr/src/app && npm install -g gulp
cd /usr/src/app && npm install gulp
cd /usr/src/app && npm install
source ~/.bash_profile

echo "Backend: compiling from typescript to JS"
cd /usr/src/app && npm run build

echo "Backend: start the server"
cd /usr/src/app && npm run start:dev


