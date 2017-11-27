import * as Hapi from "hapi";
import UserController from "./controller";
import {Documentation} from "./documentation";
import {Validator} from "./validator";

export default function (server: Hapi.Server) {

  const clientsController = new UserController();
  server.bind(clientsController);

  server.route({
    method: 'GET',
    path: '/user/{id}',
    config: {
      handler: clientsController.getUser,
      tags: ['api', 'user', 'get'],
      description: 'Get detailed information about specified user',
      validate: Validator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
      }
    },
  });
}
