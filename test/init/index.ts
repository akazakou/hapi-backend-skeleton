import * as Log from '../../src/services/logs'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

export default function () {
  // use chai-as-promised plugin
  chai.use(chaiAsPromised)

  // disable logger output for displaying only test results
  const loggerInstance = Log.init()
  for (let key in loggerInstance.transports) {
    loggerInstance.transports[key].silent = true
  }
}
