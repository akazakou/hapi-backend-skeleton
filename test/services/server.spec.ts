import * as sinon from 'sinon'
import { expect } from 'chai'
import * as Server from '../../src/services/server'
import initMocha from '../init'

describe('Server', () => {
  let sandbox: sinon.SinonSandbox

  before(() => {
    initMocha() // initialize testing environment
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should initialize server correctly', async () => {
    expect(Server.init()).to.eventually.be.fulfilled
  })

  it('should correctly process exception on plugin initialisation', async () => {
    const logsPlugin = require(`${process.cwd()}/src/plugins/logs`)
    sandbox.stub(logsPlugin, 'default').callsFake(() => {
      return {
        register: () => Promise.reject(new Error('Logs plugin testing error')),
        info: () => {
          return {
            version: '0.0.0',
            name: 'Fake logging plugin'
          }
        }
      }
    })

    expect(Server.init()).to.eventually.be.rejectedWith(Error, 'Logs plugin testing error')
  })
})
