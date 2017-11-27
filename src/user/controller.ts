import * as Hapi from 'hapi';
import * as Boom from 'boom';
import {User, IUser} from '../models/user/user';

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
}
