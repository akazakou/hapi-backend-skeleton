import { expect } from 'chai'
import * as Server from '../../src/services/server'
import * as sinon from 'sinon'
import initMocha from '../init'
import validateUser from '../../src/plugins/jwt-auth/validate'
import * as User from '../../src/models/user'
import Role from '../../src/plugins/roles/interface'

const fixtures = {
  user: {
    '_id': '59eef4f909225626a7fb0b7f',
    'updatedAt': '2018-01-22T15:57:56.659Z',
    'createdAt': '2018-01-22T15:57:56.659Z',
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJCYWNrZW5kIE5vZGUgIzEiLCJpYXQiOjE1MTY3MDM0MjEsImV4cCI6MTU0ODIzOTQyMiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic3ViIjoiNTllZWY0ZjkwOTIyNTYyNmE3ZmIwYjdmIn0.If-3JV2RdmuWN1vaQ-4bgIOasbNyo6mlfsT2YcJoC8U',
    'login': 'admin',
    'password': '$2a$08$/yO2F6cEpg6x5ENbENW03.pLruFzbhExzNmCLX1X2P5x65d09qxFO', // default value is "password"
    'isActive': false,
    'roles': [
      Role.ADMIN
    ],
    '__v': 0
  }
}

describe('Plugins', () => {
  let sandbox: sinon.SinonSandbox

  before(async () => {
    initMocha() // initialize testing environment
  })

  beforeEach(async () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(async () => {
    sandbox.restore()
  })

  describe('JWT Auth', () => {
    it('should correctly process exception on plugin initialization', done => {
      sandbox.stub(require('hapi-auth-jwt2'), 'register').throws()

      Server.init().catch((error: Error) => {
        expect(error).to.have.property('message')
        expect(error.message).to.be.equals('TypeError: refAnnotations.errors[cacheKey].push is not a function')

        done()
      })
    }).timeout(2000)

    it('should correctly process user decoded information', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))

      let result: boolean = false
      const callback = (error: Error, isValid: boolean, credentials: any) => {
        expect(error).to.be.equals(null)
        result = isValid
      }

      await validateUser({ sub: fixtures.user._id } as any, {} as any, callback)

      expect(result).to.be.equals(true)
    })

    it('should correctly process non existed user', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves()

      let result: boolean = true
      const callback = (error: Error, isValid: boolean, credentials: any) => {
        expect(error).to.be.equals(null)
        result = isValid
      }

      await validateUser({ sub: fixtures.user._id } as any, {} as any, callback)

      expect(result).to.be.equals(false)
    })

    it('should correctly process model exceptions', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).throws()

      let result: boolean = true
      const callback = (error: Error, isValid: boolean, credentials: any) => {
        expect(error).to.have.property('message')
        expect(error.message).to.be.equals('Error')
        result = isValid
      }

      await validateUser({ sub: fixtures.user._id } as any, {} as any, callback)

      expect(result).to.be.equals(false)
    })
  })
})
