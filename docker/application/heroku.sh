#!/usr/bin/env bash

# try to execute database migrations
migrate up --es6 --autosync --dbConnectionUri ${database__uri}

# starting the daemon
node build/src/index.js --server:port=${PORT}