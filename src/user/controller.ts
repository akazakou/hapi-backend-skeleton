import * as Hapi from 'hapi';
import * as Boom from 'boom';
import {User, IUser} from '../models/user/user';
import * as Config from "../config";

const config = Config.init();

export default class UserController {
  /**
   * Get detailed information about specified user
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async getUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const user: IUser = await User.findById(request.params.id);

      if (!user) {
        return reply(Boom.badRequest(`Can't find user with ID: ${request.params.id}`, {request}));
      }

      reply(user);
    } catch (err) {
      reply(Boom.badImplementation(err));
    }
  }

  /**
   * Get detailed information about all user
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async getList(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const users: IUser[] = await User.find();

      if (!users) {
        return reply(Boom.badRequest(`Can't find user with ID: ${request.params.id}`, {request}));
      }

      reply(users);
    } catch (err) {
      reply(Boom.badImplementation(err));
    }
  }

  /**
   * Validate user login and password, and generate access token, if credentials is a valid
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async loginUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    let {login, password} = request.payload;
    try {
      const user = await User.findOne({login});

      if (!user) {
        return reply(Boom.unauthorized("User does not exist"));
      }

      if (!user.validatePassword(password)) {
        return reply(Boom.unauthorized("Password is invalid"));
      }

      user.token = user.generateToken();
      user.markModified('token');
      await user.save();

      reply(user).header('X-Access-Token', user.token);
    } catch (err) {
      reply(Boom.badImplementation(err));
    }
  }

  /**
   * Check user auth status
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async authUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let user: IUser;

      if (config.get("server:auth:jwt:active")) {
        user = await User.findById(request.auth.credentials.id);
      } else {
        user = await User.findOne({});
      }

      if (!user) {
        return reply(Boom.unauthorized("User does not exist"));
      }

      reply(user);

    } catch (error) {
      reply(Boom.badImplementation());
    }
  }

  /**
   * Remove authorisation token from user entity
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async logoutUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let user: IUser;

      if (config.get("server:auth:jwt:active")) {
        user = await User.findById(request.auth.credentials.id);
      } else {
        user = await User.findOne({});
      }

      if (!user) {
        return reply(Boom.unauthorized("User does not exist"));
      }

      user.token = undefined;
      user.markModified('token');
      await user.save();

      reply(user);

    } catch (error) {
      reply(Boom.badImplementation());
    }
  }
}
