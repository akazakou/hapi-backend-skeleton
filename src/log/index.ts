import * as winston from "winston";
import * as Config from "../config";

function init() {
  // create new logger instance
  let logger = new winston.Logger();

  // logger instance switch to CLI mode
  logger.cli();

  // add console transport to logger instance object
  logger.add(winston.transports.Console, Config.init().get('log'));

  return logger;
}

export {
  init,
}