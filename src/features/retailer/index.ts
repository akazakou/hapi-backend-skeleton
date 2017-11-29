import * as Hapi from "hapi";
import RetailerController from "./controller";
import {Documentation} from "./documentation";
import {Validator} from "./validator";
import {Role} from "../../models/user/user";

export default function (server: Hapi.Server) {

  const retailerController = new RetailerController();
  server.bind(retailerController);

  server.route({
    method: 'GET',
    path: '/retailer',
    config: {
      handler: retailerController.listRetailer,
      tags: ['api', 'retailer', 'list'],
      description: 'Get list with detailed information about all retailers',
      validate: Validator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
        'roles': [Role.ADMIN],
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/retailer/{id}',
    config: {
      handler: retailerController.getRetailer,
      tags: ['api', 'retailer', 'get'],
      description: 'Get detailed information about specified retailer',
      validate: Validator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/retailer',
    config: {
      handler: retailerController.createRetailer,
      tags: ['api', 'retailer', 'create'],
      description: 'Create retailer information record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.ADMIN],
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/retailer/{id}',
    config: {
      handler: retailerController.updateRetailer,
      tags: ['api', 'retailer', 'update'],
      description: 'Update retailer information record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.ADMIN],
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/retailer/{id}',
    config: {
      handler: retailerController.deleteRetailer,
      tags: ['api', 'retailer', 'delete'],
      description: 'Update retailer information record',
      validate: Validator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN],
      }
    },
  });
}
