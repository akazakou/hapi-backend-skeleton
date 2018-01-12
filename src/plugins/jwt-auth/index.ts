import { IPlugin } from '../interfaces'
import { Server, Request } from 'hapi'
import * as User from '../../models/user'
import * as Config from '../../services/config'
import * as Log from '../../services/logs'
import * as HapiAuthJWT2 from 'hapi-auth-jwt2'

// loading configuration
const config = Config.init()

// init logger instance
const log = Log.init()

/**
 * Interface that describes an decoded object structure, assigned to key
 */
interface JWTData {
  id: string
}

const validateUser = (decoded: JWTData, request: Request, cb: Function) => {
  if (!config.get('server:auth:jwt:active')) {
    return User.Model.findOne({})
  }

  User.Model.findById(decoded.id).then((user) => {
    if (user && user.token) {
      return cb(null, true)
    }

    return cb(null, false)
  })
}

export default (): IPlugin => {
  return {
    register: async (server: Server): Promise<void> => {

      try {
        const toggle = config.get('server:auth:jwt:active') ? 'required' : false

        await server.register({ register: HapiAuthJWT2 })

        server.auth.strategy('jwt', 'jwt', toggle, {
          key: config.get('server:auth:jwt:jwtSecret'),
          validateFunc: validateUser,
          verifyOptions: { algorithms: ['HS256'] }
        })

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
