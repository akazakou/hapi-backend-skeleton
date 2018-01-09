import { IPlugin, IPluginOptions } from '../interfaces'
import { Base_Reply, PluginSpecificConfiguration, ReplyWithContinue, Request, Server } from 'hapi'
import * as Log from '../../services/logs'
import * as Boom from 'boom'
import { IUser, User } from '../../models/user'
import { Role, TypeRoles } from '../../models/user/role'

// define logger instance with category identifier
const log = Log.init()

// ignored paths
const ignored: [RegExp] = [
  new RegExp('^\/swagger'),
  new RegExp('^\/docs'),
  new RegExp('^\/graphql')
]

interface RouterPlugins extends PluginSpecificConfiguration {
  roles?: TypeRoles[]
}

const Plugin: any = {
  register: function (server: Server, options: IPluginOptions, next: any) {

    /**
     * Checking authorization levels for accessing to routes
     * @param {Request} request
     * @param {Base_Reply} reply
     */
    server.ext('onPostAuth', async function (request: Request, reply: ReplyWithContinue) {
      const route = request.route

      if (!route) {
        throw new Error(`Can't get route property from request object`)
      }

      for (let ignore of ignored) {
        if (route && ignore.test(route.path)) {
          return reply.continue()
        }
      }

      const settings = route.settings
      if (!settings) {
        throw new Error(`Can't get settings property from route object`)
      }

      const plugins: RouterPlugins | undefined = settings.plugins

      // receive required access levels for accessing to this route
      let permissions: TypeRoles[] = []
      if (!plugins) {
        // if we do not have configured access level for this route, using default access level requirements
        permissions.push(Role.UNKNOWN)
        log.debug(`Non configured access level for route ${route.path}`)
      } else {
        // receive permissions for accessing to current route
        permissions = plugins['roles'] || [Role.UNKNOWN]
      }

      // if we have unauthenticated request, check if that route allowed unauthenticated requests
      if (permissions.indexOf(Role.UNKNOWN) >= 0) {
        return reply.continue()
      }

      // if we have unauthenticated request
      if (!request.auth.isAuthenticated) {
        // checking if permissions allow access to unauthenticated users requests
        if (permissions.indexOf(Role.UNKNOWN) < 0) {
          // if route do not allow unauthenticated request
          log.warn(`Unauthorized access try to route ${route.path}`)
          return reply(Boom.forbidden(`You don't have access to the route ${route.path}`))
        } else {
          // if route allowing unauthenticated request
          return reply.continue()
        }
      }

      // receive information about authenticated user
      let user: IUser | null
      try {
        user = await User.getUserFromRequest(request)
      } catch (error) {
        return reply(error)
      }

      // if we have authenticated user and allowed access for Role.USER continue request
      if (user && user._id && request.auth.isAuthenticated && permissions.indexOf(Role.USER) !== -1) {
        return reply.continue()
      }

      // checking is the user have required access level
      for (let required of permissions) {
        for (let allowed of user.roles) {
          if (required === allowed) {
            return reply.continue()
          }
        }
      }

      // If user doesn't have permissions to access, decline it
      log.warn(`Unauthorized access try to route ${route.path} from user ${user.id}`, {
        user: user.id,
        route: route.path
      })
      return reply(Boom.forbidden(`You don't have access to the route ${route.path}`))
    })

    next()
  }
}

/**
 * Plugin attributes
 * @type {{name: string; version: string}}
 */
Plugin.register.attributes = {
  name: 'User Roles',
  version: '1.0.0'
}

/**
 * Exporting user roles plugin
 * @returns {IPlugin}
 */
export default (): IPlugin => {
  return {
    register: async function (server: Server) {
      await server.register(Plugin)
    },
    info: () => {
      return Plugin.register.attributes
    }
  }
}
