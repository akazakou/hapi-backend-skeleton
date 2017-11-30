import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Log from '../../services/log';
import {IBranch, Branch} from '../../models/branch/branch';
import {IRetailer, Retailer} from '../../models/retailer/retailer';
import {IUser, Role, User} from "../../models/user/user";
import {IOffer, Offer} from "../../models/offer/offer";

const log = Log.init();

export default class OfferController {
  /**
   * Receive list for all available Offers
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async listOffer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const retailers: IRetailer[] = await Retailer.find({isActive: true}, {_id: 1});

      reply(await Offer.find({
        retailer: {
          $in: retailers.map(data => data._id),
        }
      }));
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Getting Offer information
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async getOffer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const offer: IOffer = await Offer.findById(request.params.id);

      if (!offer) {
        return reply(Boom.badData(`Can't find Offer with ID "${request.params.id}"`, {params: request.params}));
      }

      const retailer: IRetailer = await Retailer.findById(offer.retailer);

      if (!retailer) {
        return reply(Boom.badData(`Can't find Offer for requested branch ID "${offer.id}"`, {params: request.params}));
      }

      if (!retailer.isActive) {
        return reply(Boom.forbidden(`Retailer with ID "${retailer.id}" are disabled`, {params: request.params}));
      }

      reply(offer);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Create new Offer record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async createOffer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let retailer: IRetailer;
      let loggedInUser: IUser = await User.getUserFromRequest(request);
      let currentUserRetailer: IRetailer = await Retailer.findOne({user: loggedInUser._id});

      if (loggedInUser.roles.indexOf(Role.RETAILER) !== -1 && currentUserRetailer.id === request.payload.retailer) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (loggedInUser.roles.indexOf(Role.ADMIN) !== -1) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (!retailer) {
        return reply(Boom.forbidden(`You do not allowed to create branches for that retailer`));
      }

      let branches: IBranch[] = await Branch.find({retailer});
      for (let branch of branches) {
        if (branch.retailer.toString() !== retailer.id) {
          return reply(Boom.forbidden(`Retailer with ID ${retailer.id} branch with ID "${branch.id}"`));
        }
      }

      let offer: IOffer = new Offer(request.payload);
      reply(await offer.save()).code(201);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Update existed Offer information record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async updateOffer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let offer: IOffer = await Offer.findById(request.params.id);
      if (!offer) {
        return reply(Boom.badData(`You do not allowed to create branches for that retailer`));
      }

      let retailer: IRetailer;
      let loggedInUser: IUser = await User.getUserFromRequest(request);
      let currentUserRetailer: IRetailer = await Retailer.findOne({user: loggedInUser._id});

      if (loggedInUser.roles.indexOf(Role.RETAILER) !== -1 && currentUserRetailer.id === request.payload.retailer) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (loggedInUser.roles.indexOf(Role.ADMIN) !== -1) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (!retailer) {
        return reply(Boom.forbidden(`You do not allowed to create branches for that retailer`));
      }

      let branches: IBranch[] = await Branch.find({retailer});
      for (let branch of branches) {
        if (branch.retailer.toString() !== retailer.id) {
          return reply(Boom.forbidden(`Retailer with ID ${retailer.id} branch with ID "${branch.id}"`));
        }
      }

      offer = Object.assign(offer, request.payload);
      reply(await offer.save()).code(201);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Delete branch from database
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async deleteOffer(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let offer: IOffer = await Offer.findById(request.params.id);
      if (!offer) {
        return reply(Boom.badData(`You do not allowed to create branches for that retailer`));
      }

      let retailer: IRetailer;
      let loggedInUser: IUser = await User.getUserFromRequest(request);
      let currentUserRetailer: IRetailer = await Retailer.findOne({user: loggedInUser._id});

      if (loggedInUser.roles.indexOf(Role.RETAILER) !== -1 && currentUserRetailer.id === request.payload.retailer) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (loggedInUser.roles.indexOf(Role.ADMIN) !== -1) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (!retailer) {
        return reply(Boom.forbidden(`You do not allowed to create branches for that retailer`));
      }

      await offer.remove();

      reply(offer);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }
}
