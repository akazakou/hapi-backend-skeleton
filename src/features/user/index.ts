import { Server } from 'hapi'
import UserController from './controller'
import { Documentation } from './documentation'
import { Validator } from './validator'
import { Role } from '../../models/roles/interface'

export default function (server: Server) {

  const clientsController = new UserController()
  server.bind(clientsController)

  server.route({
    method: 'GET',
    path: '/user/{id}',
    config: {
      handler: clientsController.getUser,
      tags: ['api', 'user'],
      description: 'Get detailed information about specified user',
      validate: Validator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
        'roles': [Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      handler: clientsController.getList,
      tags: ['api', 'user'],
      description: 'Get detailed information about all users',
      validate: Validator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
        'roles': [Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/user',
    config: {
      handler: clientsController.createUser,
      tags: ['api', 'user'],
      description: 'Create new user record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'PATCH',
    path: '/user/{id}',
    config: {
      handler: clientsController.updateUser,
      tags: ['api', 'user'],
      description: 'Update user record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/user/{id}',
    config: {
      handler: clientsController.deleteUser,
      tags: ['api', 'user'],
      description: 'Mark user inavtive',
      validate: Validator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/user/auth',
    config: {
      auth: false,
      handler: clientsController.loginUser,
      tags: ['api', 'auth'],
      description: 'Validate user login and password',
      validate: Validator.login,
      plugins: {
        'hapi-swagger': Documentation.login,
        'roles': [Role.UNKNOWN]
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/user/auth',
    config: {
      handler: clientsController.logoutUser,
      tags: ['api', 'auth'],
      description: 'Remove authorisation token from user object',
      validate: Validator.logout,
      plugins: {
        'hapi-swagger': Documentation.logout,
        'roles': [Role.USER]
      }
    }
  })

  server.route({
    method: 'PATCH',
    path: '/user/auth',
    config: {
      handler: clientsController.authUser,
      tags: ['api', 'auth'],
      description: 'Update user authorisation status',
      validate: Validator.auth,
      plugins: {
        'hapi-swagger': Documentation.auth,
        'roles': [Role.USER]
      }
    }
  })
}
