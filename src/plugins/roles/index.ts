import { IPlugin } from '../interfaces'
import { PluginSpecificConfiguration, Request, ResponseToolkit, Server } from 'hapi'
import * as Log from '../../services/logs'
import { Boom, forbidden, internal } from 'boom'
import * as User from '../../models/user'
import { TypeRoles } from './interface'

// define logger instance with category identifier
const log = Log.init()

// ignored paths
const ignored: RegExp[] = [
  new RegExp('^\/swagger'),
  new RegExp('^\/$')
]

interface RouterPlugins extends PluginSpecificConfiguration {
  roles?: TypeRoles[]
}

const Plugin: any = {
  /**
   * That hook will be activated only if auth on route configuration are enabled
   * @param {Server} server
   * @param next
   */
  register: async function (server: Server): Promise<void> {

    /**
     * Checking authorization levels for accessing to routes
     * @param {Request} request
     * @param {Base_Reply} reply
     */
    server.ext('onPostAuth', async function (request: Request, reply: ResponseToolkit): Promise<Boom | symbol> {
      const route = Object.assign({}, {settings: undefined, path: ''}, request.route)

      for (let ignore of ignored) {
        if (route && ignore.test(route.path)) {
          return reply.continue
        }
      }

      if (route.settings.auth === false) {
        return reply.continue
      }

      const plugins: RouterPlugins | undefined = route.settings && route.settings.plugins

      // receive required access levels for accessing to this route
      let permissions: TypeRoles[] = []
      if (plugins && plugins.roles) {
        // receive permissions for accessing to current route
        permissions = plugins.roles
      } else {
        // if we do not have configured access level for this route, using default access level requirements
        log.debug(`Non configured access level for route ${route.path}`)
        return forbidden(`That route should contain configured roles section in configuration ${route.path}`)
      }

      // receive information about authenticated user
      let user: User.Interface | null
      try {
        user = await User.Model.getUserFromRequest(request)
      } catch (error) {
        return internal(error)
      }

      // checking is the user have required access level
      if (user && user.id) {
        for (let required of permissions) {
          for (let allowed of user.roles) {
            if (required === allowed) {
              return reply.continue
            }
          }
        }
      }

      // If user doesn't have permissions to access, decline it
      log.warn(`Unauthorized access try to route ${route.path} from user ${user.id || JSON.stringify(user)}`, {
        user: user.id || user,
        route: route.path
      })

      return forbidden(`You don't have access to the route ${route.path}`)
    })
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

Plugin.name = 'User Roles'

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
