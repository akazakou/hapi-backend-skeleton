#!/bin/bash

echo "Backend: clear NPM cache"
rm /tmp/* -R -f

echo "Backend: clear NPM modules"
cd /usr/src/app && rm node_modules -R -f

echo "Backend: Installing APT Dependencies"
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
apt-get update && apt-get install mongodb-org-tools

echo "Backend: installing node modules"
cd /usr/src/app && npm install -g gulp migrate-mongoose
cd /usr/src/app && npm install gulp
cd /usr/src/app && npm install
source ~/.bash_profile

echo "Backend: compiling from typescript to JS"
cd /usr/src/app && npm run build

echo "Backend: apply migrations to database"
cd /usr/src/app && migrate up --es6 --autosync --dbConnectionUri $database__uri

echo "Backend: start the server"
cd /usr/src/app && npm run start:dev


