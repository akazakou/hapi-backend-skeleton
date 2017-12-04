import { IPlugin } from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      const packageInfo = require('../../../../package.json');

      return server.register([
        require('inert'),
        require('vision'),
        {
          register: require('hapi-swagger'),
          options: {
            info: {
              title: packageInfo.title,
              description: packageInfo.description,
              version: packageInfo.version
            },
            tags: [
              {
                name: 'auth',
                description:'Api interface for manipulate User Authorisation'
              },
              {
                name: 'user',
                description:'Api interface for manipulate User Entity'
              },
            ],
            documentationPath: '/docs'
          }
        }
      ]);
    },
    info: () => {
      return {
        name: "Swagger Documentation",
        version: "1.0.0"
      };
    }
  };
};
