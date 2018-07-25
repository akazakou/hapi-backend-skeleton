import { createLogger, Logger, LoggerOptions, transports } from 'winston'

let logger: Logger

function init (reinit: boolean = false): Logger {
  if (!logger || reinit) {
    // create new logger instance
    logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console()
      ]
    } as LoggerOptions)
  }

  // logger instance
  return logger
}

export {
  init
}
