import {IPlugin} from "../interfaces";
import * as Hapi from "hapi";
import * as Log from "../../log";

const good = require('good');

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      return server.register({
        register: good,
        options: {
          reporters: {
            winston: [{
              module: 'good-winston',
              args: [{
                log: '*',
                response: '*',
                ops: false,
                winston: Log.init(),
              }]
            }],
          }
        }
      });
    },
    info: () => {
      return {
        name: "Winston Logger",
        version: "1.0.0"
      };
    }
  };
};
