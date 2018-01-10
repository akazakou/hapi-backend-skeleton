import * as Hapi from 'hapi'
import ProfileController from './controller'
import { Documentation } from './documentation'
import { Validator as BasicValidator } from '../basic/validator'
import { Validator } from './validator'
import { Role } from '../../models/roles/interface'

export default function (server: Hapi.Server) {

  const controller = new ProfileController()
  server.bind(controller)

  server.route({
    method: 'GET',
    path: '/profile/{id}',
    config: {
      handler: controller.getModel,
      tags: ['api', 'user', 'get', 'profile'],
      description: 'Get detailed information about specified user profile',
      validate: BasicValidator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
        'roles': [Role.UNKNOWN]
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/profile/list',
    config: {
      handler: controller.getList,
      tags: ['api', 'user', 'list', 'profile'],
      description: 'Get detailed information about all user profiles',
      validate: BasicValidator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
        'roles': [Role.UNKNOWN]
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/profile',
    config: {
      handler: controller.createModel,
      tags: ['api', 'user', 'create', 'profile'],
      description: 'Create new user profile record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.USER]
      }
    }
  })

  server.route({
    method: 'PATCH',
    path: '/profile/{id}',
    config: {
      handler: controller.updateModel,
      tags: ['api', 'user', 'update', 'profile'],
      description: 'Update user record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.USER]
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/profile/{id}',
    config: {
      handler: controller.deleteModel,
      tags: ['api', 'user', 'delete', 'profile'],
      description: 'Delete user profile from database',
      validate: BasicValidator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN]
      }
    }
  })
}
