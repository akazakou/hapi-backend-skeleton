import { expect } from 'chai'
import * as Log from '../../src/services/logs'
import initMocha from '../init'

describe('Logs', () => {
  before(() => {
    initMocha() // initialize testing environment
  })

  it('should initialize logs correctly', done => {
    let logs = Log.init()

    // expect existing of functions for logging
    expect(logs).to.include.keys(['warn', 'info', 'error', 'debug'])
    // expect that key should be a function
    expect(logs.warn).a('function')
    done()
  })
})
