import * as Config from "../config";
import * as Hapi from "hapi";

/**
 * Initialization of Hapi HTTP web server
 * @returns {Podium}
 */
function init() {
  // loading configuration
  const config = Config.init();

  // initializing server
  let server = new Hapi.Server();

  // establish connection
  server.connection({
    port: config.get("server:port"),
  });

  // initialize service for manipulate of tasks
  //TaskerService.init(server);

  // return server instance
  return server;
}

export {
  init
}