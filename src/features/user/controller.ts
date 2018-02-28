import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { badData, badImplementation, badRequest, Boom, unauthorized } from 'boom'
import * as User from '../../models/user'
import * as Log from '../../services/logs'
import BasicController from '../basic/controller'
import { AuthorizedRequest, CreateUserRequest, LoginUserRequest, UpdateUserRequest } from './request'

/**
 * Initialization of logger instance
 * @type {LoggerInstance}
 */
const log = Log.init()

export default class UserController extends BasicController<User.Interface> {
  public constructor () {
    super(User.Model)
  }

  /**
   * Create new user record
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<void>}
   */
  public static async createUser (request: CreateUserRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let existedUser: User.Interface | null = await User.Model.findOne({login: request.payload.login})
      if (existedUser) {
        return badData(`User with login "${request.payload.login}" already exists`)
      }

      let user: User.Interface = new User.Model(request.payload)

      await user.save()

      return toolkit.response(user)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Update existing user record by user ID
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<Response>}
   */
  public static async updateUser (request: UpdateUserRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let user: User.Interface | null = await User.Model.findById(request.params.id)

      if (!user) {
        return badRequest(`Can't find user with ID: ${request.params.id}`, {request})
      }

      let existedUser: User.Interface | null = await User.Model.findOne({
        _id: {$ne: user.id},
        login: request.payload.login
      })

      if (existedUser && existedUser.id !== user.id) {
        return badData(`User with login "${request.payload.login}" already exists`)
      }

      user = Object.assign(user as User.Interface, request.payload as User.Interface)

      for (let propertyName in request.payload) {
        user.markModified(propertyName)
      }

      user = await user.save()

      return toolkit.response(user)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Validate user login and password, and generate access token, if credentials is a valid
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<Response>}
   */
  public static async loginUser (request: LoginUserRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    let {login, password} = request.payload
    try {
      const user: User.Interface | null = await User.Model.findOne({login})

      if (!user) {
        return unauthorized('User does not exist')
      }

      if (!user.validatePassword(password)) {
        return unauthorized('Password is invalid')
      }

      user.token = user.generateToken()
      user.markModified('token')
      await user.save()

      return toolkit.response(user).header('X-Access-Token', user.token)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Check user auth status
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<void>}
   */
  public static async authUser (request: AuthorizedRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let user: User.Interface | null = await User.Model.findById(request.auth.credentials.sub)

      if (!user) {
        return unauthorized('User does not exist')
      }

      user.generateToken()

      await user.save()

      return toolkit.response(user)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Remove authorisation token from user entity
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<void>}
   */
  public static async logoutUser (request: AuthorizedRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let user: User.Interface | null = await User.Model.findById(request.auth.credentials.sub)

      if (!user) {
        return unauthorized('User does not exist')
      }

      user.token = undefined
      user.markModified('token')
      await user.save()

      return toolkit.response(user)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Disallow user to login into backend application
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<void>}
   */
  public static async deleteUser (request: Request, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let user: User.Interface | null = await User.Model.findById(request.params.id)

      if (!user) {
        return badRequest(`Can't find user with ID: ${request.params.id}`, {request})
      }

      user.isActive = false
      user.markModified('isActive')
      await user.save()

      return toolkit.response(user)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }
}
