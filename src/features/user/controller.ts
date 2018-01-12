import { ReplyNoContinue, Request } from 'hapi'
import * as Boom from 'boom'
import * as User from '../../models/user'
import * as Config from '../../services/config'
import { Provider } from 'nconf'

/**
 * Initialized configuration instance
 * @type {Provider}
 */
const config: Provider = Config.init()

export default class UserController {
  /**
   * Get detailed information about specified user
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public static async getUser (request: Request, reply: ReplyNoContinue) {
    try {
      const user: User.Interface | null = await User.Model.findById(request.params.id)

      if (!user) {
        return reply(Boom.badRequest(`Can't find user with ID: ${request.params.id}`, { request }))
      }

      reply(user)
    } catch (err) {
      reply(Boom.badImplementation(err.message, err))
    }
  }

  /**
   * Get detailed information about all user
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public static async getList (request: Request, reply: ReplyNoContinue) {
    try {
      const users: User.Interface[] = await User.Model.find()

      if (!users) {
        return reply(Boom.badRequest(`Can't find user with ID: ${request.params.id}`, { request }))
      }

      reply(users)
    } catch (err) {
      reply(Boom.badImplementation(err.message, err))
    }
  }

  /**
   * Create new user record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public static async createUser (request: Request, reply: ReplyNoContinue) {
    try {
      let existedUser: User.Interface | null = await User.Model.findOne({ login: request.payload.login })
      if (existedUser) {
        return reply(Boom.badData(`User with login "${request.payload.login}" already exists`))
      }

      let user: User.Interface = new User.Model(request.payload)

      await user.save()

      reply(user)
    } catch (err) {
      reply(Boom.badImplementation(err.message, err))
    }
  }

  /**
   * Update existing user record by user ID
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public static async updateUser (request: Request, reply: ReplyNoContinue) {
    try {
      let user: User.Interface | null = await User.Model.findById(request.params.id)

      if (!user) {
        return reply(Boom.badRequest(`Can't find user with ID: ${request.params.id}`, { request }))
      }

      let existedUser: User.Interface | null = await User.Model.findOne({ login: request.payload.login })
      if (existedUser && existedUser.id !== user.id) {
        return reply(Boom.badData(`User with login "${request.payload.login}" already exists`))
      }

      user = Object.assign(user as User.Interface, request.payload as User.Interface)

      for (let propertyName in request.payload) {
        if (user.hasOwnProperty(propertyName)) {
          user.markModified(propertyName)
        }
      }

      user = await user.save()

      reply(user)
    } catch (err) {
      reply(Boom.badImplementation(err.message, err))
    }
  }

  /**
   * Validate user login and password, and generate access token, if credentials is a valid
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public static async loginUser (request: Request, reply: ReplyNoContinue) {
    let { login, password } = request.payload
    try {
      const user: User.Interface | null = await User.Model.findOne({ login })

      if (!user) {
        return reply(Boom.unauthorized('User does not exist'))
      }

      if (!user.validatePassword(password)) {
        return reply(Boom.unauthorized('Password is invalid'))
      }

      user.token = user.generateToken()
      user.markModified('token')
      await user.save()

      reply(user).header('X-Access-Token', user.token)
    } catch (err) {
      reply(Boom.badImplementation(err.message, err))
    }
  }

  /**
   * Check user auth status
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public static async authUser (request: Request, reply: ReplyNoContinue) {
    try {
      let user: User.Interface | null

      if (config.get('server:auth:jwt:active')) {
        user = await User.Model.findById(request.auth.credentials.id)
      } else {
        user = await User.Model.findOne({})
      }

      if (!user) {
        return reply(Boom.unauthorized('User does not exist'))
      }

      user.generateToken()
      user.markModified('token')
      await user.save()

      reply(user)

    } catch (error) {
      reply(Boom.badImplementation())
    }
  }

  /**
   * Remove authorisation token from user entity
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public static async logoutUser (request: Request, reply: ReplyNoContinue) {
    try {
      let user: User.Interface | null

      if (config.get('server:auth:jwt:active')) {
        user = await User.Model.findById(request.auth.credentials.id)
      } else {
        user = await User.Model.findOne({})
      }

      if (!user) {
        return reply(Boom.unauthorized('User does not exist'))
      }

      user.token = undefined
      user.markModified('token')
      await user.save()

      reply(user)

    } catch (error) {
      reply(Boom.badImplementation())
    }
  }

  /**
   * Disallow user to login into backend application
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public static async deleteUser (request: Request, reply: ReplyNoContinue) {
    try {
      let user: User.Interface | null = await User.Model.findById(request.params.id)

      if (!user) {
        return reply(Boom.badRequest(`Can't find user with ID: ${request.params.id}`, { request }))
      }

      user.isActive = false
      user.markModified('isActive')

      reply(await user.save())
    } catch (error) {
      reply(Boom.badImplementation())
    }
  }
}
