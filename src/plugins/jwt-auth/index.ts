import { IPlugin } from '../interfaces'
import { Server } from 'hapi'
import * as Config from '../../services/config'
import * as Log from '../../services/logs'
import validateUser from './validate'

// loading configuration
const config = Config.init()

// init logger instance
const log = Log.init()

export default (): IPlugin => {
  return {
    register: async (server: Server): Promise<void> => {
      try {
        // registering new plugin in server instance
        await server.register(require('hapi-auth-jwt2'))

        // defining new auth strategy
        server.auth.strategy('jwt', 'jwt', {
          key: config.get('server:auth:jwt:privateKey'),
          validate: validateUser,
          verifyOptions: { algorithms: ['HS256'] }
        })

        // setting default auth strategy as JWT
        server.auth.default('jwt')

      } catch (error) {
        log.error(`Catch error on token validation: ${error.message}`, { err: error })
        throw new Error(error)
      }
    },
    info: () => {
      return {
        name: 'JWT Authentication',
        version: '1.0.0'
      }
    }
  }
}
