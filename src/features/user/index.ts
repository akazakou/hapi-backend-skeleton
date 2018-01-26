import { Server } from 'hapi'
import UserController from './controller'
import { Documentation } from './documentation'
import { Validator } from './validator'
import { Validator as BasicValidator } from '../basic/validator'
import { Role } from '../../plugins/roles/interface'

export default function (server: Server) {

  const controller = new UserController()
  server.bind(controller)

  server.route({
    method: 'GET',
    path: '/user/{id}',
    config: {
      handler: controller.getModel,
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
      handler: controller.getList,
      tags: ['api', 'user'],
      description: 'Get detailed information about all users',
      validate: BasicValidator.list,
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
      handler: UserController.createUser,
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
      handler: UserController.updateUser,
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
      handler: UserController.deleteUser,
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
      handler: UserController.loginUser,
      tags: ['api', 'auth'],
      description: 'Validate user login and password',
      validate: Validator.login,
      plugins: {
        'hapi-swagger': Documentation.login
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/user/auth',
    config: {
      handler: UserController.logoutUser,
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
      handler: UserController.authUser,
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
