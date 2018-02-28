import * as Hapi from 'hapi'
import ProfileController from './controller'
import { Documentation } from './documentation'
import { Validator as BasicValidator } from '../basic/validator'
import { Validator } from './validator'
import { Role } from '../../plugins/roles/interface'
import * as Config from '../../services/config'

// initialization of application configuration
const config = Config.init()

export default function (server: Hapi.Server) {

  const controller = new ProfileController()
  server.bind(controller)

  server.route({
    method: 'GET',
    path: '/profile/{id}',
    handler: controller.getModel,
    options: {
      cors: config.get('server:cors'),
      auth: false,
      tags: ['api', 'profile'],
      description: 'Get detailed information about specified user profile',
      validate: BasicValidator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
      }
    } as Hapi.RouteOptions
  } as Hapi.ServerRoute)

  server.route({
    method: 'POST',
    path: '/profiles',
    handler: controller.getList,
    options: {
      cors: config.get('server:cors'),
      auth: false,
      tags: ['api', 'profile'],
      description: 'Get detailed information about all user profiles',
      validate: BasicValidator.list,
      plugins: {
        'hapi-swagger': Documentation.list
      }
    } as Hapi.RouteOptions
  } as Hapi.ServerRoute)

  server.route({
    method: 'POST',
    path: '/profile',
    handler: controller.createModel,
    options: {
      cors: config.get('server:cors'),
      auth: 'jwt',
      tags: ['api', 'profile'],
      description: 'Create new user profile record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.USER, Role.ADMIN]
      }
    } as Hapi.RouteOptions
  } as Hapi.ServerRoute)

  server.route({
    method: 'PATCH',
    path: '/profile/{id}',
    handler: controller.updateModel,
    options: {
      cors: config.get('server:cors'),
      auth: 'jwt',
      tags: ['api', 'profile'],
      description: 'Update user record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.USER, Role.ADMIN]
      }
    } as Hapi.RouteOptions
  } as Hapi.ServerRoute)

  server.route({
    method: 'DELETE',
    path: '/profile/{id}',
    handler: controller.deleteModel,
    options: {
      cors: config.get('server:cors'),
      auth: 'jwt',
      tags: ['api', 'profile'],
      description: 'Delete user profile from database',
      validate: BasicValidator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN]
      }
    } as Hapi.RouteOptions
  } as Hapi.ServerRoute)
}
