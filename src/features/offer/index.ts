import * as Hapi from "hapi";
import OfferController from "./controller";
import {Documentation} from "./documentation";
import {Validator} from "./validator";
import {Role} from "../../models/user/user";

export default function (server: Hapi.Server) {

  const offerController = new OfferController();
  server.bind(offerController);

  server.route({
    method: 'GET',
    path: '/offer',
    config: {
      auth: false,
      handler: offerController.listOffer,
      tags: ['api', 'offer', 'list'],
      description: 'Get list with detailed information about all offers',
      validate: Validator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
        'roles': [Role.UNKNOWN],
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/offer/{id}',
    config: {
      auth: false,
      handler: offerController.getOffer,
      tags: ['api', 'offer', 'get'],
      description: 'Get detailed information about specified offer',
      validate: Validator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
        'roles': [Role.UNKNOWN],
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/offer',
    config: {
      handler: offerController.createOffer,
      tags: ['api', 'offer', 'create'],
      description: 'Create offer information record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/offer/{id}',
    config: {
      handler: offerController.updateOffer,
      tags: ['api', 'offer', 'update'],
      description: 'Update offer information record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/offer/{id}',
    config: {
      handler: offerController.deleteOffer,
      tags: ['api', 'offer', 'delete'],
      description: 'Update offer information record',
      validate: Validator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });
}
