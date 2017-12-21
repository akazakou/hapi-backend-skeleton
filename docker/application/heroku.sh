#!/usr/bin/env bash

# try to execute database migrations
npm run migrate:up

# starting the daemon
node build/src/index.js --server:port=${PORT}
