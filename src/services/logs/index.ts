import { Logger, LoggerInstance, transports } from 'winston'
import * as Config from '../config'

let logger: LoggerInstance

function init (reinit: boolean = false): LoggerInstance {
  if (!logger || reinit) {
    // create new logger instance
    logger = new Logger()

    // add console transport to logger instance object
    logger.add(transports.Console, Config.init().get('log'))
  }

  // logger instance
  return logger
}

export {
  init
}
