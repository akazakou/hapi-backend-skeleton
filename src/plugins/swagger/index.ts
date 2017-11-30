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
                description:'API endpoint for manipulating User Authentication'
              },
              {
                name: 'user',
                description:'Api interface for manipulate User Information'
              },
              {
                name: 'retailer',
                description:'Api interface for manipulate Retailer information'
              },
              {
                name: 'branch',
                description:'Api interface for manipulate Branch information'
              },
              {
                name: 'offer',
                description:'Api interface for manipulate Offer information'
              },
              {
                name: 'plan',
                description:'Api interface for manipulate Plan information'
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
