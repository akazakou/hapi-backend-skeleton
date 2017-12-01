import * as Hapi from "hapi";
import BranchController from "./controller";
import {Documentation} from "./documentation";
import {Validator} from "./validator";
import {Role} from "../../models/user/user";

export default function (server: Hapi.Server) {

  const branchController = new BranchController();
  server.bind(branchController);

  server.route({
    method: 'GET',
    path: '/branch',
    config: {
      auth: false,
      handler: branchController.listBranch,
      tags: ['api', 'branch', 'list'],
      description: 'Get list with detailed information about all branches',
      validate: Validator.list,
      plugins: {
        'hapi-swagger': Documentation.list,
        'roles': [Role.UNKNOWN],
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/branch/{id}',
    config: {
      auth: false,
      handler: branchController.getBranch,
      tags: ['api', 'branch', 'get'],
      description: 'Get detailed information about specified branch',
      validate: Validator.get,
      plugins: {
        'hapi-swagger': Documentation.get,
        'roles': [Role.UNKNOWN],
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/branch',
    config: {
      handler: branchController.createBranch,
      tags: ['api', 'branch', 'create'],
      description: 'Create branch information record',
      validate: Validator.create,
      plugins: {
        'hapi-swagger': Documentation.create,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'PUT',
    path: '/branch/{id}',
    config: {
      handler: branchController.updateBranch,
      tags: ['api', 'retailer', 'update'],
      description: 'Update branch information record',
      validate: Validator.update,
      plugins: {
        'hapi-swagger': Documentation.update,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });

  server.route({
    method: 'DELETE',
    path: '/branch/{id}',
    config: {
      handler: branchController.deleteBranch,
      tags: ['api', 'branch', 'delete'],
      description: 'Update branch information record',
      validate: Validator.delete,
      plugins: {
        'hapi-swagger': Documentation.delete,
        'roles': [Role.ADMIN, Role.RETAILER],
      }
    },
  });
}
