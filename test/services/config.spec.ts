import { expect } from 'chai'
import * as Config from '../../src/services/config'
import initMocha from '../init'

describe('Configuration', () => {
  before(() => {
    initMocha() // initialize testing environment
  })

  it('should initialize configuration correctly', async () => {
    let config = Config.init().get('server')

    // check existing values from default configuration file
    expect(config).to.include.keys(['port'])
  })
})
