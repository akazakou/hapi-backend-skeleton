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
    sandbox = sinon.createSandbox()
  })

  afterEach(async () => {
    sandbox.restore()
  })

  describe('JWT Auth', () => {
    it('should correctly process exception on plugin initialization', async () => {
      let pkg = require('hapi-auth-jwt2')
      sandbox.stub(pkg.plugin, 'register').throws()
      expect(Server.init()).to.eventually.rejectedWith(Error, 'Error')
    })

    it('should correctly process user decoded information', async () => {
      sandbox.stub(User.Model, 'findOne').withArgs({
        _id: fixtures.user._id,
        token: fixtures.user.token,
      }).resolves(new User.Model(fixtures.user))

      const result = validateUser({sub: fixtures.user._id} as any, {headers: {authorization: fixtures.user.token}} as any)
      expect(result).to.eventually.have.property('isValid', true, 'property isValid property should be true')
    })

    it('should correctly process non existed user', async () => {
      sandbox.stub(User.Model, 'findOne').withArgs({
        _id: fixtures.user._id,
        token: fixtures.user.token,
      }).resolves(null)

      const result = validateUser({sub: fixtures.user._id} as any, {headers: {authorization: fixtures.user.token}} as any)
      expect(result).to.eventually.have.property('isValid', false, 'property isValid property should be false')
    })

    it('should correctly process model exceptions', async () => {
      sandbox.stub(User.Model, 'findOne').withArgs({
        _id: fixtures.user._id,
        token: fixtures.user.token,
      }).throws()

      let result = validateUser({sub: fixtures.user._id} as any, {headers: {authorization: fixtures.user.token}} as any)
      expect(result).to.eventually.rejectedWith(Error, 'Error', 'Validation should be rejected with Error object')
    })

    it('should correctly process unauth user without header auth information', async () => {
      const result = validateUser({sub: fixtures.user._id} as any, {} as any)
      expect(result).to.eventually.have.property('isValid', false, 'property isValid property should be false')
    })
  })
})
