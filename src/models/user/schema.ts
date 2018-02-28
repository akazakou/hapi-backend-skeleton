import { Request } from 'hapi'
import * as Mongoose from 'mongoose'
import * as Jwt from 'jsonwebtoken'
import * as Config from '../../services/config'
import * as Boom from 'boom'
import { Role, TypeRoles } from '../../plugins/roles/interface'
import Interface from './interface'
import * as Bcrypt from 'bcrypt'
import { Provider } from 'nconf'
import { AuthorizedRequest } from '../../features/user/request'

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
    default: [Role.USER],
    validate: [rolesValidator, 'Array of user roles contains non existed role']
  },
  /**
   * JWT Auth token value
   */
  token: { type: String, required: false },
  /**
   * Flag that indicates the user is active or not
   */
  isActive: { type: Boolean, required: true, default: true },
  /**
   * Login will be used for identify user
   */
  login: { type: String, required: true, unique: true },
  /**
   * Password hash for validation of user authorisation
   */
  password: { type: String, required: true, set: hashPassword }
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
  // setting current date
  const current = new Date()

  // set default expiration to one year
  let expire = new Date()
  expire.setTime(expire.getTime() + config.get('server:auth:jwt:expireIn'))

  this.token = Jwt.sign({
    'iss': config.get('server:title'),
    'iat': Math.floor(current.getTime() / 1000),
    'exp': Math.floor(expire.getTime() / 1000),
    'aud': config.get('server:url'),
    'sub': this.id
  }, config.get('server:auth:jwt:privateKey'))

  this.markModified('token')

  return this.token
}

/**
 * Parse Hapi request and extract user object from it
 * @param {Request} request
 * @returns {Promise<IUser>}
 */
Schema.statics.getUserFromRequest = async function (request: AuthorizedRequest): Promise<Interface> {
  if (!request.auth || !request.auth.credentials || !request.auth.credentials.sub) {
    throw Boom.unauthorized(`User not authorised`)
  }

  return this.findById(request.auth.credentials.sub)
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
  transform: toObject
})

/**
 * Remove password field from raw objects
 */
Schema.set('toObject', {
  transform: toObject
})

/**
 * Remove password field from results object
 * @param {Interface} document
 * @param {Interface} result
 * @returns {Interface}
 */
function toObject (document: Interface, result: Interface) {
  delete result.password
  return result
}

/**
 * Hashing password on update that field ot creating new user record
 */
function hashPassword (raw: string): string {
  try {
    // checking is that raw value already are hashed string
    Bcrypt.getRounds(raw)
  } catch (error) {
    // if it isn't, we are hashing that string
    return Bcrypt.hashSync(raw, Bcrypt.genSaltSync(8))
  }

  // if it is already hashed string, we are just return it without update
  return raw
}

/**
 * Validate roles set to update user object
 * @param {TypeRoles[]} roles
 * @returns {boolean}
 */
function rolesValidator (roles: TypeRoles[]) {
  let allowed = Role.toArray()
  for (let check of roles) {
    if (allowed.indexOf(check) === -1) {
      return false
    }
  }

  return true
}

export {
  rolesValidator
}

export default Schema
