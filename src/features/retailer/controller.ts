import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Log from '../../services/log';
import {IRetailer, Retailer} from '../../models/retailer/retailer';
import {IUser, Role, User} from "../../models/user/user";

const log = Log.init();

export default class RetailerController {
  /**
   * Receive list for all available retailers
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async listRetailer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      reply(await Retailer.find());
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Getting retailer information. Allowed only for admin users and user, who own that retailer
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async getRetailer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const retailer: IRetailer = await Retailer.findById(request.params.id);

      if (!retailer) {
        return reply(Boom.badData(`Can't find retailer with ID "${request.params.id}"`, {params: request.params}));
      }

      const retailerUser: IUser = await User.findById(retailer.user);
      const loggedInUser: IUser = await User.getUserFromRequest(request);

      // if someone except Admin or Retailer owner tried to receive information about other retailers
      if (loggedInUser.roles.indexOf(Role.ADMIN) === -1 && retailerUser.id !== loggedInUser.id) {
        log.warn(`User with ID "${loggedInUser.id}" tried receive access to retailer info with ID "${retailer.id}"`, {loggedInUser, retailerUser, retailer});
        return reply(Boom.forbidden(`You can't see other retailers information`));
      }

      reply(retailer);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Create new retailer record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async createRetailer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let retailer: IRetailer = new Retailer(request.payload);
      retailer = await retailer.save();
      reply(retailer).code(201);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Update existed retailer information record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async updateRetailer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let retailer: IRetailer = await Retailer.findById(request.params.id);

      if (!retailer) {
        return reply(Boom.badData(`Can't find retailer with ID "${request.params.id}"`, {params: request.params}));
      }

      retailer = Object.assign(retailer, request.payload);
      for (let propertyName in request.payload) {
        if (retailer[propertyName]) {
          retailer.markModified(propertyName);
        }
      }

      reply(await retailer.save());
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Mark retailer as deleted
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async deleteRetailer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let retailer: IRetailer = await Retailer.findById(request.params.id);

      if (!retailer) {
        return reply(Boom.badData(`Can't find retailer with ID "${request.params.id}"`, {params: request.params}));
      }

      retailer.isActive = false;
      retailer.markModified('isActive');

      reply(await retailer.save());
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }
}
