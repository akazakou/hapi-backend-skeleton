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
      tags: ['api', 'user', 'get'],
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
    path: '/user/list',
    config: {
      handler: clientsController.getList,
      tags: ['api', 'user', 'list'],
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
      tags: ['api', 'user', 'create'],
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
      tags: ['api', 'user', 'update'],
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
      tags: ['api', 'user', 'delete'],
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
    path: '/auth',
    config: {
      auth: false,
      handler: clientsController.loginUser,
      tags: ['api', 'auth', 'create'],
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
    path: '/auth',
    config: {
      handler: clientsController.logoutUser,
      tags: ['api', 'auth', 'delete'],
      description: 'Remove authorisation token from user object',
      validate: Validator.logout,
      plugins: {
        'hapi-swagger': Documentation.logout,
        'roles': [Role.USER]
      }
    }
  })

  server.route({
    method: 'PUT',
    path: '/auth',
    config: {
      handler: clientsController.authUser,
      tags: ['api', 'auth', 'update'],
      description: 'Update user authorisation status',
      validate: Validator.auth,
      plugins: {
        'hapi-swagger': Documentation.auth,
        'roles': [Role.USER]
      }
    }
  })
}
