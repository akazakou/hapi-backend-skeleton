import { expect } from 'chai'
import { Server as HapiServer } from 'hapi'
import * as Server from '../../src/services/server'
import * as User from '../../src/models/user'
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
      Role.ADMIN,
      Role.USER
    ],
    '__v': 0
  }
}

describe('Features', () => {
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

  describe('User', () => {
    describe('Delete User', () => {
      it('should report about error on user deletion action', async () => {
        let UserModelFindById = sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id)
        UserModelFindById.onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.onCall(1).throws()

        const response = await server.inject({
          method: 'DELETE',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should generate error on non existed user ID', async () => {
        let UserModelFindById = sandbox.stub(User.Model, 'findById')
        UserModelFindById.withArgs(fixtures.user._id).onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.withArgs('59eef4f909225626a7fb0b7b').resolves()

        const response = await server.inject({
          method: 'DELETE',
          url: `/user/59eef4f909225626a7fb0b7b`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        expect(response.statusCode).to.be.equals(400)
        expect(response.result).to.be.deep.equals({
          'error': 'Bad Request',
          'message': 'Can\'t find user with ID: 59eef4f909225626a7fb0b7b',
          'statusCode': 400
        })
      })

      it('should process user deletion correctly', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model.prototype, 'save').resolves(Object.assign({}, new User.Model(fixtures.user), {
          isActive: false
        }))

        const response = await server.inject({
          method: 'DELETE',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        const expected = Object.assign({}, fixtures.user, {password: undefined})
        delete expected.password

        expect(response.statusCode).to.be.equals(200)
        expect(JSON.parse(JSON.stringify(response.result))).to.be.deep.equals(expected)
      })
    })

    describe('Logout User', () => {
      it('should report about error on user logout', async () => {
        let UserModelFindById = sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id)
        UserModelFindById.onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.onCall(1).throws()

        const response = await server.inject({
          method: 'DELETE',
          url: `/user/auth`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should generate error on non existed user ID', async () => {
        let UserModelFindById = sandbox.stub(User.Model, 'findById')
        UserModelFindById.withArgs(fixtures.user._id).onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.withArgs('59eef4f909225626a7fb0b7b').resolves()

        const response = await server.inject({
          method: 'DELETE',
          url: `/user/auth`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        expect(response.statusCode).to.be.equals(401)
        expect(response.result).to.be.deep.equals({
          'error': 'Unauthorized',
          'message': 'User does not exist',
          'statusCode': 401
        })
      })

      it('should process user logout correctly', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model.prototype, 'save').resolves(Object.assign({}, new User.Model(fixtures.user), {
          isActive: false
        }))

        const response = await server.inject({
          method: 'DELETE',
          url: `/user/auth`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        const expected = Object.assign({}, fixtures.user, {password: undefined})
        delete expected.password
        delete expected.token

        expect(response.statusCode).to.be.equals(200)
        expect(JSON.parse(JSON.stringify(response.result))).to.be.deep.equals(expected)
      })
    })

    describe('Auth User', () => {
      it('should report about error on user auth action', async () => {
        let UserModelFindById = sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id)
        UserModelFindById.onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.onCall(1).throws()

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/auth`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should generate error on non existed user ID', async () => {
        let UserModelFindById = sandbox.stub(User.Model, 'findById')
        UserModelFindById.withArgs(fixtures.user._id).onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.withArgs('59eef4f909225626a7fb0b7b').resolves()

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/auth`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        expect(response.statusCode).to.be.equals(401)
        expect(response.result).to.be.deep.equals({
          'error': 'Unauthorized',
          'message': 'User does not exist',
          'statusCode': 401
        })
      })

      it('should process user logout correctly', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model.prototype, 'save').resolves(Object.assign({}, new User.Model(fixtures.user), {
          isActive: false
        }))

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/auth`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        const expected = Object.assign({}, fixtures.user, {password: undefined})
        delete expected.password
        delete expected.token

        const result: any = Object.assign({}, JSON.parse(JSON.stringify(response.result)))
        delete result.token

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(expected)
      })
    })

    describe('Login User', () => {
      it('should report about error on user login action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: 'login'}).throws()

        const response = await server.inject({
          method: 'POST',
          url: `/user/auth`,
          payload: {
            login: 'login',
            password: 'password'
          }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should generate error on non existed user ID', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: 'login'}).resolves()

        const response = await server.inject({
          method: 'POST',
          url: `/user/auth`,
          payload: {
            login: 'login',
            password: 'password'
          }
        })

        expect(response.statusCode).to.be.equals(401)
        expect(response.result).to.be.deep.equals({
          'error': 'Unauthorized',
          'message': 'User does not exist',
          'statusCode': 401
        })
      })

      it('should process user logout correctly', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: 'login'}).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model.prototype, 'save').withArgs({login: 'login'}).resolves(new User.Model(fixtures.user))

        const response = await server.inject({
          method: 'POST',
          url: `/user/auth`,
          payload: {
            login: 'login',
            password: 'password'
          }
        })

        const expected = Object.assign({}, fixtures.user, {password: undefined})
        delete expected.password
        delete expected.token

        const result: any = Object.assign({}, JSON.parse(JSON.stringify(response.result)))
        delete result.token

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(expected)
      })

      it('should generate error on wrong password received', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: 'login'}).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model.prototype, 'save').withArgs({login: 'login'}).resolves(new User.Model(fixtures.user))

        const response = await server.inject({
          method: 'POST',
          url: `/user/auth`,
          payload: {
            login: 'login',
            password: 'password2'
          }
        })

        expect(response.statusCode).to.be.equals(401)
        expect(response.result).to.be.deep.equals({
          'error': 'Unauthorized',
          'message': 'Password is invalid',
          'statusCode': 401
        })
      })
    })

    describe('Update User', () => {
      it('should report about error on user update action', async () => {
        const UserModelFindById = sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id)

        UserModelFindById.onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.onCall(1).throws()

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': true,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should generate error on non existed user ID', async () => {
        const UserModelFindById = sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id)

        UserModelFindById.onCall(0).resolves(new User.Model(fixtures.user))
        UserModelFindById.onCall(1).resolves()

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': true,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        expect(response.statusCode).to.be.equals(400)
        expect(response.result).to.be.deep.equals({
          'error': 'Bad Request',
          'message': 'Can\'t find user with ID: 59eef4f909225626a7fb0b7f',
          'statusCode': 400
        })
      })

      it('should process user update correctly', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({
          login: fixtures.user.login,
          _id: {$ne: fixtures.user._id}
        }).resolves()
        sandbox.stub(User.Model.prototype, 'save').resolves(new User.Model(fixtures.user))

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': false,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        const expected = Object.assign({}, fixtures.user, {password: undefined})
        delete expected.password
        delete expected.token

        const result: any = Object.assign({}, JSON.parse(JSON.stringify(response.result)))
        delete result.token

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(expected)
      })

      it('should generate error on not unique login', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({
          login: fixtures.user.login,
          _id: {$ne: fixtures.user._id}
        }).resolves(Object.assign({}, new User.Model(fixtures.user), {_id: 'fake_id'}))

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': true,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        expect(response.statusCode).to.be.equals(422)
        expect(response.result).to.be.deep.equals({
          'error': 'Unprocessable Entity',
          'message': 'User with login "admin" already exists',
          'statusCode': 422
        })
      })
    })

    describe('Create User', () => {
      it('should report about error on user update action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: fixtures.user.login}).throws()

        const response = await server.inject({
          method: 'POST',
          url: `/user`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': true,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should generate error on existed user login', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: fixtures.user.login}).resolves(new User.Model(fixtures.user))

        const response = await server.inject({
          method: 'POST',
          url: `/user`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': true,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        expect(response.statusCode).to.be.equals(422)
        expect(response.result).to.be.deep.equals({
          'error': 'Unprocessable Entity',
          'message': 'User with login "admin" already exists',
          'statusCode': 422
        })
      })

      it('should process user create correctly', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({login: fixtures.user.login}).resolves()
        sandbox.stub(User.Model.prototype, 'save').resolves(new User.Model(fixtures.user))

        const response = await server.inject({
          method: 'POST',
          url: `/user`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': false,
            'login': 'admin',
            'password': 'password',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        const expected = Object.assign({}, fixtures.user, {password: undefined})
        delete expected.password
        delete expected.token
        delete expected._id
        delete expected.__v
        delete expected.createdAt
        delete expected.updatedAt

        const result: any = Object.assign({}, JSON.parse(JSON.stringify(response.result)))
        delete result.token
        delete result._id
        delete result.__v
        delete result.createdAt
        delete result.updatedAt

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(expected)
      })

      it('should generate error on not unique login', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(User.Model, 'findOne').withArgs({
          login: fixtures.user.login,
          _id: {$ne: fixtures.user._id}
        }).resolves(Object.assign({}, new User.Model(fixtures.user), {_id: 'fake_id'}))

        const response = await server.inject({
          method: 'PATCH',
          url: `/user/${fixtures.user._id}`,
          credentials: {sub: `${fixtures.user._id}`},
          payload: {
            'isActive': true,
            'login': 'admin',
            'password': 'password123',
            'roles': [Role.ADMIN, Role.USER]
          }
        })

        expect(response.statusCode).to.be.equals(422)
        expect(response.result).to.be.deep.equals({
          'error': 'Unprocessable Entity',
          'message': 'User with login "admin" already exists',
          'statusCode': 422
        })
      })
    })
  })
})
