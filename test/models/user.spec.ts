import { expect } from 'chai'
import * as User from '../../src/models/user'
import * as sinon from 'sinon'
import Role from '../../src/plugins/roles/interface'
import initMocha from '../init'
import * as Config from '../../src/services/config'
import { Provider } from 'nconf'
import { rolesValidator } from '../../src/models/user/schema'

/**
 * Initialization of configuration object
 * @type {Provider}
 */
const config: Provider = Config.init()

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

describe('Models', () => {
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

  describe('User', () => {
    it('should hashing user password on set value', async () => {
      let user: User.Interface = new User.Model(fixtures.user)
      user.set('password', 'new_password_value')
      expect(user.validatePassword('new_password_value')).to.be.equals(true)
    })

    it('should correctly process non existed auth information on user object extraction from request', async () => {
      try {
        await User.Model.getUserFromRequest({} as any)
      } catch (error) {
        expect(error).to.have.property('message')
        expect(error.message).to.be.equals('User not authorised')
      }
    })

    it('should correctly generate JWT token with all requested data', async () => {
      let user: User.Interface = new User.Model(fixtures.user)

      const token = user.generateToken()
      expect(token).to.be.an('string').and.contains('.')

      const parts = token.split('.')
      expect(parts).to.be.an('array').and.to.have.lengthOf(3)

      const data = JSON.parse(new Buffer(parts[1], 'base64').toString('utf8'))
      expect(data).to.have.property('iss').and.to.be.equals(config.get('server:title'))
      expect(data).to.have.property('iat').and.to.be.an('number')
      expect(data).to.have.property('exp').and.to.be.an('number')
      expect(data).to.have.property('aud').and.to.be.equals(config.get('server:url'))
      expect(data).to.have.property('sub').and.to.be.equals(fixtures.user._id)
    })

    it('should correctly validate password', async () => {
      let user: User.Interface = new User.Model(fixtures.user)
      expect(user.validatePassword('password')).to.be.equals(true)
    })

    it('should correctly process roles field validator', async () => {
      const result: boolean = rolesValidator([Role.ADMIN, Role.USER])
      expect(result).to.be.equals(true)
    })

    it('should correctly process roles field validator with unknown roles', async () => {
      const result: boolean = rolesValidator(['some_strange_role'] as any)
      expect(result).to.be.equals(false)
    })

    it('should remove password property from JSON objects', async () => {
      let user: User.Interface = new User.Model(fixtures.user)
      expect(user.toJSON()).does.not.has.property('password')
      expect(user.toObject()).does.not.has.property('password')
    })
  })
})
