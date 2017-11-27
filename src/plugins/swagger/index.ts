import { IPlugin } from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      return server.register([
        require('inert'),
        require('vision'),
        {
          register: require('hapi-swagger'),
          options: {
            info: {
              title: 'Ads Platform API',
              description: 'Ads Platform API documentation',
              version: '0.0.1'
            },
            tags: [
              {
                name: 'users',
                description:'Api interface for manipulate user information'
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
