import { expect } from 'chai'
import * as Log from '../../src/services/logs'
import initMocha from '../init'

describe('Logs', () => {
  before(() => {
    initMocha() // initialize testing environment
  })

  it('should initialize logs correctly', async () => {
    let logs = Log.init()

    expect(logs).to.include.keys(['warn', 'info', 'error', 'debug'])
    expect(logs.warn).a('function')
    expect(logs.info).a('function')
    expect(logs.error).a('function')
    expect(logs.debug).a('function')
  })
})
