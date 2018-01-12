import { Request } from 'hapi'
import * as Mongoose from 'mongoose'
import * as Jwt from 'jsonwebtoken'
import * as Config from '../../services/config'
import * as Boom from 'boom'
import { Role, TypeRoles } from '../../plugins/roles/interface'
import Interface from './interface'

/**
 * Initialization of configuration object
 * @type {Provider}
 */
const config = Config.init()

/**
 * Description of user schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * Assigned user access roles
   */
  roles: {
    type: [String],
    required: true,
    default: [Role.EVERYONE],
    validate: [(val: string[]) => {
      let allowed = [Role.ADMIN, Role.USER, Role.EVERYONE]
      for (let check of val) {
        if (allowed.indexOf(check as TypeRoles) === -1) {
          return false
        }
      }

      return true
    }, 'Array of user roles contains non existed role']
  },
  /**
   * JWT Auth token value
   */
  token: { type: String, required: false }
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true
})

/**
 * Generate new authorization token
 * @returns {any | number | PromiseLike<ArrayBuffer> | Buffer | string}
 */
Schema.methods.generateToken = function () {
  return Jwt.sign({ id: this.id }, config.get('server:auth:jwt:jwtSecret'))
}

/**
 * Parse Hapi request and extract user object from it
 * @param {Request} request
 * @returns {Promise<IUser>}
 */
Schema.statics.getUserFromRequest = async function (request: Request): Promise<Interface> {
  if (config.get('server:auth:jwt:active')) {
    if (!request.auth || !request.auth.credentials || !request.auth.credentials.id) {
      throw Boom.unauthorized(`User not authorised`)
    }

    return this.findById(request.auth.credentials.id)
  }

  return this.findOne()
}

export default Schema
