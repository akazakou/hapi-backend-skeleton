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
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should initialize server correctly', done => {
    Server.init().then(() => {
      done()
    }).catch((error: Error) => {
      console.log(error)
    })
  }).timeout(1000)

  it('should correctly process exception on plugin initialisation', done => {
    const logsPlugin = require(`${global.__basedir}/src/plugins/logs`)
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

    Server.init().catch((error: Error) => {
      expect(error).to.have.property('message')
      expect(error.message).to.be.equals('Logs plugin testing error')

      done()
    })
  }).timeout(1000)
})
