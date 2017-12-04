// setting EventEmitter maxListeners
require('events').EventEmitter.defaultMaxListeners = 100;

import * as Server from "./services/server";
import * as Log from "./services/logs";
import * as Database from "./services/database";

// initializing logger instance
const log = Log.init();

// reporting about uncaught exception
process.on('uncaughtException', (error: Error) => {
  log.warn(`Detect uncaughtException: ${error.toString()}`);
});

Database.init().then(() => {
  // initializing server client
  const server = Server.init();

  server.then(server => {
    server.start(() => {
      log.info(`Server running at: ${server.info.uri}`);
    });
  }).catch(error => {
    log.error("Can't start server because: " + error.message, error);
  });
});
