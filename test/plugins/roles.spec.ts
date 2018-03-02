import { expect } from 'chai'
import * as Server from '../../src/services/server'
import * as User from '../../src/models/user'
import { Request, ResponseToolkit, Server as HapiServer } from 'hapi'
import * as sinon from 'sinon'
import Role from '../../src/plugins/roles/interface'
import initMocha from '../init'

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
  let server: HapiServer

  before(async () => {
    initMocha() // initialize testing environment
    server = await Server.init()
  })

  beforeEach(async () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(async () => {
    sandbox.restore()
  })

  describe('Roles', () => {
    it('should generate access denied error for user without required permissions', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(Object.assign({}, fixtures.user, {
        'roles': [Role.USER]
      })))

      const response = server.inject({
        method: 'GET',
        url: `/user/${fixtures.user._id}`,
        credentials: {sub: `${fixtures.user._id}`}
      })

      expect(response).to.eventually.have.property('statusCode').and.to.be.equals(403)
    })

    it('should give access to route for user with correct roles set', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))

      const response = server.inject({
        method: 'GET',
        url: `/user/${fixtures.user._id}`,
        credentials: {sub: `${fixtures.user._id}`}
      })

      expect(response).to.eventually.have.property('statusCode').and.to.be.equals(200)
    })

    it('should correctly process exception', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).throws()

      const response = server.inject({
        method: 'GET',
        url: `/user/${fixtures.user._id}`,
        credentials: {sub: `${fixtures.user._id}`}
      })

      expect(response).to.eventually.have.property('statusCode').and.to.be.equals(500)
    })

    it('should correctly process non existed user', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves({})

      const response = server.inject({
        method: 'GET',
        url: `/user/${fixtures.user._id}`,
        credentials: {sub: `${fixtures.user._id}`}
      })

      expect(response).to.eventually.have.property('statusCode').and.to.be.equals(403)
    })

    it('should correctly process required auth route without roles set', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).throws()

      server.route({
        method: 'OPTIONS',
        path: '/test/with-auth-without-roles',
        handler: ((_request: Request, reply: ResponseToolkit) => {
          return reply.response()
        }),
        options: {
          tags: ['test', 'mocha'],
          description: 'Checking correctly processing of required auth route without roles set',
        }
      })

      const response = server.inject({
        method: 'OPTIONS',
        url: `/test/with-auth-without-roles`,
        credentials: {sub: `${fixtures.user._id}`}
      })

      expect(response).to.eventually.have.property('statusCode').and.to.be.equals(403)
    })

    it('should correctly ignore registered ignoring route patterns', async () => {
      sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).throws()

      server.route({
        method: 'OPTIONS',
        path: '/swagger/ignoring-patterns',
        handler: ((_request: Request, reply: ResponseToolkit) => {
          return reply.response()
        }),
        options: {
          tags: ['test', 'mocha'],
          description: 'Checking correctly ignoring registered ignoring route patterns'
        }
      })

      const response = server.inject({
        method: 'OPTIONS',
        url: `/swagger/ignoring-patterns`,
        credentials: {sub: `${fixtures.user._id}`}
      })

      expect(response).to.eventually.have.property('statusCode').and.to.be.equals(200)
    })
  })
})
