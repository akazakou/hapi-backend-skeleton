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
              title: 'Candle Backend API',
              description: 'Documentation for Candle Backend API application',
              version: '0.0.1'
            },
            tags: [
              {
                name: 'auth',
                description:'API endpoint for manipulating user authentication'
              },
              {
                name: 'user',
                description:'Api interface for manipulate user information'
              },
              {
                name: 'retailer',
                description:'Api interface for manipulate retailer information'
              },
              {
                name: 'branch',
                description:'Api interface for manipulate branch information'
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
