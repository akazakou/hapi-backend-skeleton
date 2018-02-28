import { expect } from 'chai'
import * as Server from '../../src/services/server'
import * as User from '../../src/models/user'
import * as Profile from '../../src/models/profile'
import { Server as ServerInterface } from 'hapi'
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
  },
  profiles: [
    {
      '_id': '59eef4f909225626a7fb0b7a',
      'user': '59eef4f909225626a7fb0b7f',
      'email': 'address1@example.com',
      'firstName': 'FirstName1',
      'lastName': 'LastName1',
      'createdAt': '2017-11-27T11:09:15.463Z',
      'updatedAt': '2017-11-27T11:09:15.463Z',
      '__v': 0
    },
    {
      '_id': '59eef4f909225626a7fb0b7b',
      'user': '59eef4f909225626a7fb0b7f',
      'email': 'address2@example.com',
      'firstName': 'FirstName2',
      'lastName': 'LastName2',
      'createdAt': '2017-11-27T11:09:15.463Z',
      'updatedAt': '2017-11-27T11:09:15.463Z',
      '__v': 0
    }
  ]
}

describe('Features', () => {
  let server: ServerInterface
  let sandbox: sinon.SinonSandbox

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

  describe('Profile', () => {
    describe('Delete Profile', () => {
      it('should report about error on profile deletion action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').withArgs(fixtures.profiles[0]._id).throws()

        const response = await server.inject({
          method: 'DELETE',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should report about non existed profile on delete action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').withArgs(fixtures.profiles[0]._id).resolves(null)

        const response = await server.inject({
          method: 'DELETE',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` }
        })

        expect(response.statusCode).to.be.equals(422)
        expect(response.result).to.be.deep.equals({
          'error': 'Unprocessable Entity',
          'message': 'Can\'t find model Function with ID 59eef4f909225626a7fb0b7a',
          'statusCode': 422
        })
      })

      it('should correctly delete profile from database', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').withArgs(fixtures.profiles[0]._id).resolves(new Profile.Model(fixtures.profiles[0]))
        sandbox.stub(Profile.Model.prototype, 'remove').resolves()

        const response = await server.inject({
          method: 'DELETE',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` }
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(fixtures.profiles[0])
      })
    })

    describe('Update Profile', () => {
      it('should report about error on profile update action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').withArgs(fixtures.profiles[0]._id).throws()

        const response = await server.inject({
          method: 'PATCH',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            email: 'some@fake.email',
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName'
          }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should report about non existed profile on update action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').withArgs(fixtures.profiles[0]._id).resolves(null)

        const response = await server.inject({
          method: 'PATCH',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            email: 'some@fake.email',
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName'
          }
        })

        expect(response.statusCode).to.be.equals(422)
        expect(response.result).to.be.deep.equals({
          'error': 'Unprocessable Entity',
          'message': 'Can\'t find model Function with ID 59eef4f909225626a7fb0b7a',
          'statusCode': 422
        })
      })

      it('should correctly delete profile from database', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').withArgs(fixtures.profiles[0]._id).resolves(new Profile.Model(fixtures.profiles[0]))
        sandbox.stub(Profile.Model.prototype, 'save').resolves(new Profile.Model(fixtures.profiles[0]))

        const response = await server.inject({
          method: 'PATCH',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            email: 'some@fake.email',
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName'
          }
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(fixtures.profiles[0])
      })
    })

    describe('Create Profiles', () => {
      it('should report about error on profile create action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model.prototype, 'save').throws()

        const response = await server.inject({
          method: 'POST',
          url: `/profile`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            email: 'some@fake.email',
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName'
          }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should correctly create profile from database', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model.prototype, 'save').resolves(new Profile.Model(fixtures.profiles[0]))

        const response = await server.inject({
          method: 'POST',
          url: `/profile`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            email: 'some@fake.email',
            firstName: 'fakeFirstName',
            lastName: 'fakeLastName'
          }
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(201)
        expect(result).to.be.deep.equals(fixtures.profiles[0])
      })
    })

    describe('List Profile', () => {
      it('should report about error on profiles list action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'find').throws()

        const response = await server.inject({
          method: 'POST',
          url: `/profiles`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            skip: 1,
            limit: 2,
            sort: { _id: -1 }
          }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should correctly list profiles from database', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'find').returns({
          skip: () => sandbox.spy(),
          limit: () => sandbox.spy(),
          sort: () => sandbox.spy(),
          exec: () => Promise.resolve(fixtures.profiles.map(data => new Profile.Model(data)))
        })

        const response = await server.inject({
          method: 'POST',
          url: `/profiles`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            skip: 1,
            limit: 2,
            sort: { _id: -1 }
          }
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(fixtures.profiles.map(data => JSON.parse(JSON.stringify(new Profile.Model(data)))))
      })

      it('should correctly list profile id\'s from database on empty payload', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'find').returns({
          skip: () => sandbox.spy(),
          limit: () => sandbox.spy(),
          sort: () => sandbox.spy(),
          exec: () => Promise.resolve(fixtures.profiles.map(data => new Profile.Model({ _id: data._id })))
        })

        const response = await server.inject({
          method: 'POST',
          url: `/profiles`,
          credentials: { sub: `${fixtures.user._id}` },
          payload: {
            query: {},
            fields: { _id: 1 }
          }
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(fixtures.profiles.map(data => { return { _id: data._id } }))
      })
    })

    describe('Get Profile', () => {
      it('should report about error on profile get action', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').throws()

        const response = await server.inject({
          method: 'GET',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` }
        })

        expect(response.statusCode).to.be.equals(500)
        expect(response.result).to.be.deep.equals({
          'statusCode': 500,
          'error': 'Internal Server Error',
          'message': 'An internal server error occurred'
        })
      })

      it('should correctly get profile from database', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').resolves(new Profile.Model(fixtures.profiles[0]))

        const response = await server.inject({
          method: 'GET',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: { sub: `${fixtures.user._id}` }
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(200)
        expect(result).to.be.deep.equals(fixtures.profiles[0])
      })

      it('should correctly report about not founded profile', async () => {
        sandbox.stub(User.Model, 'findById').withArgs(fixtures.user._id).resolves(new User.Model(fixtures.user))
        sandbox.stub(Profile.Model, 'findById').resolves(null)

        const response = await server.inject({
          method: 'GET',
          url: `/profile/${fixtures.profiles[0]._id}`,
          credentials: {sub: `${fixtures.user._id}`}
        })

        let result = JSON.parse(JSON.stringify(response.result))

        expect(response.statusCode).to.be.equals(404)
        expect(response.result).to.be.deep.equals({
          'statusCode': 404,
          'error': 'Not Found',
          'message': 'Model with ID 59eef4f909225626a7fb0b7a are not found'
        })
      })
    })
  })
})
