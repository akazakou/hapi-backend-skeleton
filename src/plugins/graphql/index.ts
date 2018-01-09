import { graphqlHapi, HapiPluginOptions } from 'apollo-server-hapi';
import { Server, PluginAttributes, PluginRegistrationObject } from "hapi";
import { IPlugin, IPluginInfo } from '../interfaces';
import Schema from "./schema";

/**
 * Plugin attributes definition
 * @type {PluginAttributes}
 */
const attributes: PluginAttributes = {
  name: "Apollo GraphQL Server",
  version: graphqlHapi.version || require('../../../../package.json').dependencies['apollo-server-hapi'].replace('^', ''),
};

/**
 * Exporting user roles plugin
 * @returns {IPlugin}
 */
export default (): IPlugin => {
  return {
    /**
     * Register plugin in server instance
     * @param {Server} server
     * @returns {Promise<Error | null>}
     */
    register: async function (server: Server) {
      return new Promise((resolve, reject) => {
        try {
          // define plugin registration object
          const plugin: PluginRegistrationObject<HapiPluginOptions> = {
            register: graphqlHapi.register,
            options: {
              path: '/graphql',
              graphqlOptions: {
                schema: Schema,
              },
              route: {
                cors: true,
                auth: false,
              },
            } as HapiPluginOptions,
          };

          // assign attributes property
          plugin.register.attributes = attributes;

          // register plugin registration object into server instance
          server.register(plugin);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },

    /**
     * Plugin description for server reporting
     * @returns {IPluginInfo}
     */
    info: () => {
      return attributes as IPluginInfo;
    }
  };
};
