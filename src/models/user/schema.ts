import { Request } from 'hapi'
import * as Mongoose from 'mongoose'
import * as Jwt from 'jsonwebtoken'
import * as Config from '../../services/config'
import * as Boom from 'boom'
import { Role, TypeRoles } from '../../plugins/roles/interface'
import Interface from './interface'
import * as Bcrypt from 'bcrypt'
import { Provider } from 'nconf'

/**
 * Initialization of configuration object
 * @type {Provider}
 */
const config: Provider = Config.init()

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
  token: { type: String, required: false },
  /**
   * Flag that indicates the user is active or not
   */
  isActive: { type: Boolean, required: true, unique: false, default: true },
  /**
   * Login will be used for identify user
   */
  login: { type: String, required: true, unique: true },
  /**
   * Password hash for validation of user authorisation
   */
  password: { type: String, required: true }
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

/**
 * Validate password that was requested on auth method
 * @param {string} requestPassword
 * @returns {string}
 */
Schema.methods.validatePassword = function (requestPassword: string) {
  return Bcrypt.compareSync(requestPassword, this.password)
}

/**
 * Remove password field from JSON objects
 */
Schema.set('toJSON', {
  transform: function (document: Interface, result: any) {
    if (result.password) {
      delete result.password
    }

    return result
  }
})

/**
 * Hashing password on update that field ot creating new user record
 */
Schema.pre('save', function (this: Interface, next) {
  if (this.isModified('password')) {
    this.password = Bcrypt.hashSync(this.password, Bcrypt.genSaltSync(8))
  }

  next()
})

export default Schema
