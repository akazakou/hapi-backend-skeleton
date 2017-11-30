import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Log from '../../services/log';
import {IBranch, Branch} from '../../models/branch/branch';
import {IRetailer, Retailer} from '../../models/retailer/retailer';
import {IUser, Role, User} from "../../models/user/user";

const log = Log.init();

export default class BranchController {
  /**
   * Receive list for all available Branches
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async listBranch(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const retailers: IRetailer[] = await Retailer.find({isActive: true}, {_id: 1});

      reply(await Branch.find({
        retailer: {
          $in: retailers.map(data => data._id),
        }
      }));
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Getting Branch information. Allowed only for admin users and user, who own that Branch
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async getBranch(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const branch: IBranch = await Branch.findById(request.params.id);

      if (!branch) {
        return reply(Boom.badData(`Can't find Branch with ID "${request.params.id}"`, {params: request.params}));
      }

      const retailer: IRetailer = await Retailer.findById(branch.retailer);

      if (!retailer) {
        return reply(Boom.badData(`Can't find retailer for requested branch ID "${branch.id}"`, {params: request.params}));
      }

      if (!retailer.isActive) {
        return reply(Boom.forbidden(`Retailer with ID "${retailer.id}" are disabled`, {params: request.params}));
      }

      reply(branch);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Create new Branch record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async createBranch(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let retailer: IRetailer;
      let user: IUser = await User.getUserFromRequest(request);
      let currentUserRetailer: IRetailer = await Retailer.findOne({user: user._id});

      if (user.roles.indexOf(Role.RETAILER) !== -1 && currentUserRetailer.id === request.payload.retailer) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (user.roles.indexOf(Role.ADMIN) !== -1) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (!retailer) {
        return reply(Boom.forbidden(`You do not allowed to create branches for that retailer`));
      }

      let branch: IBranch = new Branch(request.payload);
      reply(await branch.save()).code(201);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Update existed Branch information record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async updateBranch(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let branch: IBranch = await Branch.findById(request.params.id);

      if (!branch) {
        return reply(Boom.badData(`Can't find branch with ID "${request.params.id}"`));
      }

      let retailer: IRetailer;
      let user: IUser = await User.getUserFromRequest(request);
      let currentUserRetailer: IRetailer = await Retailer.findOne({user: user._id});

      if (user.roles.indexOf(Role.RETAILER) !== -1 && currentUserRetailer.id === request.payload.retailer) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (user.roles.indexOf(Role.ADMIN) !== -1) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (!retailer) {
        return reply(Boom.forbidden(`You do not allowed to create branches for that retailer`));
      }

      branch = Object.assign(branch, request.payload);
      for (let propertyName in request.payload) {
        if (branch[propertyName]) {
          branch.markModified(propertyName);
        }
      }

      reply(await branch.save());
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
  public async deleteBranch(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let branch: IBranch = await Branch.findById(request.params.id);

      if (!branch) {
        return reply(Boom.badData(`Can't find branch with ID "${request.params.id}"`));
      }

      let retailer: IRetailer;
      let user: IUser = await User.getUserFromRequest(request);
      let currentUserRetailer: IRetailer = await Retailer.findOne({user: user._id});

      if (user.roles.indexOf(Role.RETAILER) !== -1 && currentUserRetailer.id === request.payload.retailer) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (user.roles.indexOf(Role.ADMIN) !== -1) {
        retailer = await Retailer.findById(request.payload.retailer);
      }

      if (!retailer) {
        return reply(Boom.forbidden(`You do not allowed to delete branches for that retailer`));
      }

      await branch.remove();

      reply(branch);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }
}
