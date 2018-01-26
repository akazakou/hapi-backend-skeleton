import * as Hapi from 'hapi'
import ProfileController from './controller'
import { Documentation } from './documentation'
import { Validator as BasicValidator } from '../basic/validator'
import { Validator } from './validator'
import { Role } from '../../plugins/roles/interface'

export default function (server: Hapi.Server) {

  const controller = new ProfileController()
  server.bind(controller)

  server.route({
    method: 'GET',
    path: '/profile/{id}',
    config: {
      auth: false,
      handler: controller.getModel,
      tags: ['api', 'profile'],
      description: 'Get detailed information about specified user profile',
      validate: BasicValidator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/profiles',
    config: {
      auth: false,
      handler: controller.getList,
      tags: ['api', 'profile'],
      description: 'Get detailed information about all user profiles',
      validate: BasicValidator.list,
      plugins: {
        'hapi-swagger': Documentation.list
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/profile',
    config: {
      handler: controller.createModel,
      tags: ['api', 'profile'],
      description: 'Create new user profile record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.USER, Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'PATCH',
    path: '/profile/{id}',
    config: {
      handler: controller.updateModel,
      tags: ['api', 'profile'],
      description: 'Update user record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.USER, Role.ADMIN]
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/profile/{id}',
    config: {
      handler: controller.deleteModel,
      tags: ['api', 'profile'],
      description: 'Delete user profile from database',
      validate: BasicValidator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN]
      }
    }
  })
}
