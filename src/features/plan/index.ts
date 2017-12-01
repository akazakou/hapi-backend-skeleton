import * as Hapi from "hapi";
import PlanController from "./controller";
import {Documentation} from "./documentation";
import {Validator} from "./validator";
import {Role} from "../../models/user/user";

export default function (server: Hapi.Server) {

  const planController = new PlanController();
  server.bind(planController);

  server.route({
    method: 'GET',
    path: '/plan',
    config: {
      auth: false,
      handler: planController.listPlan,
      tags: ['api', 'plan', 'list'],
      description: 'Get list with detailed information about all plans',
      validate: Validator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
        'roles': [Role.UNKNOWN],
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/plan/{id}',
    config: {
      auth: false,
      handler: planController.getPlan,
      tags: ['api', 'plan', 'get'],
      description: 'Get detailed information about specified plan',
      validate: Validator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
        'roles': [Role.UNKNOWN],
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/plan',
    config: {
      handler: planController.createPlan,
      tags: ['api', 'plan', 'create'],
      description: 'Create plan information record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/plan/{id}',
    config: {
      handler: planController.updatePlan,
      tags: ['api', 'retailer', 'update'],
      description: 'Update plan information record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/plan/{id}',
    config: {
      handler: planController.deletePlan,
      tags: ['api', 'plan', 'delete'],
      description: 'Update plan information record',
      validate: Validator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });
}
