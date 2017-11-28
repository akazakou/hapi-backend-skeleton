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

  server.route({
    method: 'GET',
    path: '/user',
    config: {
      handler: clientsController.getList,
      tags: ['api', 'user', 'list'],
      description: 'Get detailed information about all users',
      validate: Validator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/user/login',
    config: {
      auth: false,
      handler: clientsController.loginUser,
      tags: ['api', 'user', 'login'],
      description: 'Validate user login and password',
      validate: Validator.login,
      plugins: {
        'hapi-swagger': Documentation.login,
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/user/logout',
    config: {
      handler: clientsController.logoutUser,
      tags: ['api', 'user', 'logout'],
      description: 'Remove authorisation token from user object',
      validate: Validator.logout,
      plugins: {
        'hapi-swagger': Documentation.logout,
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/user/auth',
    config: {
      handler: clientsController.authUser,
      tags: ['api', 'user', 'auth'],
      description: 'Update user authorisation status',
      validate: Validator.auth,
      plugins: {
        'hapi-swagger': Documentation.auth,
      }
    },
  });
}
