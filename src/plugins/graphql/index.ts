import * as Hapi from 'hapi';
import { graphqlHapi } from 'apollo-server-hapi';
import { IPlugin } from '../interfaces';

const myGraphQLSchema = {};

const packageInfo = require('../../../../package.json');
const info = {
  name: graphqlHapi.name || "Apollo GraphQL Server",
  version: graphqlHapi.version || packageInfo.dependencies['apollo-server-hapi'].replace('^', ''),
};

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      const register: any = graphqlHapi.register;
      register.attributes = info;

      return server.register({
        register: register,
        options: {
          path: '/graphql',
          graphqlOptions: {
            schema: myGraphQLSchema,
          },
          route: {
            cors: true,
          },
        },
      });
    },
    info: () => {
      return info;
    }
  };
};
