import { Logger, LoggerInstance, transports } from 'winston'
import * as Config from '../config'

function init (): LoggerInstance {
  // create new logger instance
  let logger = new Logger()

  // logger instance switch to CLI mode
  logger.cli()

  // add console transport to logger instance object
  logger.add(transports.Console, Config.init().get('log'))

  return logger
}

export {
  init
}
