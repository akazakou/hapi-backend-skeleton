import * as Log from '../../src/services/logs'
import { transports } from 'winston'

export default function () {
  // define base directory path
  global.__basedir = `${__dirname}/../..`

  // disable logger output for displaying only test results
  const loggerInstance = Log.init()
  for (let key in loggerInstance.transports) {
    loggerInstance.remove(loggerInstance.transports[key])
  }
}
