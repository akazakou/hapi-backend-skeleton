import * as Hapi from 'hapi';
import * as Boom from 'boom';
import {IPlan, Plan} from '../../models/plan/plan';
import {IRetailer, Retailer} from '../../models/retailer/retailer';

export default class PlanController {
  /**
   * Receive list for all available Plans
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async listPlan(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      reply(await Plan.find());
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Getting Plan information
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async getPlan(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      const plan: IPlan = await Plan.findById(request.params.id);

      if (!plan) {
        return reply(Boom.badData(`Can't find Plan with ID "${request.params.id}"`, {params: request.params}));
      }

      reply(plan);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Create new Plan record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async createPlan(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let plan: IPlan = new Plan(request.payload);
      reply(await plan.save()).code(201);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Update existed Plan information record
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void>}
   */
  public async updatePlan(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let plan: IPlan = await Plan.findById(request.params.id);

      if (!plan) {
        return reply(Boom.badData(`Can't find plan with ID "${request.params.id}"`));
      }

      plan = Object.assign(plan, request.payload);
      for (let propertyName in request.payload) {
        if (plan[propertyName]) {
          plan.markModified(propertyName);
        }
      }

      reply(await plan.save());
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }

  /**
   * Delete Plan from database
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<Response>}
   */
  public async deletePlan(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    try {
      let plan: IPlan = await Plan.findById(request.params.id);

      if (!plan) {
        return reply(Boom.badData(`Can't find plan with ID "${request.params.id}"`));
      }

      const retailers: IRetailer[] = await Retailer.find({plan});

      if (retailers && retailers.length > 0) {
        return reply(Boom.badData(`You can't delete assigned to retailer plans`, {retailers: retailers.map(data => data.id)}));
      }

      await plan.remove();

      reply(plan);
    } catch (err) {
      reply(Boom.badImplementation(err.message, err));
    }
  }
}
