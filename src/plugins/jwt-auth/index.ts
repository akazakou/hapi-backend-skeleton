import {IPlugin, IPluginOptions} from "../interfaces";
import * as Hapi from "hapi";
import {User} from "../../models/user/user";
import * as Config from "../../config";

// loading configuration
const config = Config.init();

export default (): IPlugin => {
  return {
    register: async (server: Hapi.Server): Promise<void> => {
      const validateUser = (decoded, request, cb) => {
        if (config.get("server:auth:jwt:active")) {
          User.findById(decoded.id)
            .then((user) => {
              if (!user) {
                return cb(null, false);
              }
              return cb(null, true);
            });
        } else {
          return User.findOne();
        }
      };
      try {
        await server.register({register: require('hapi-auth-jwt2')});
        server.auth.strategy('jwt', 'jwt', config.get("server:auth:jwt:active"), {
          key: config.get("server:auth:jwt:jwtSecret"),
          validateFunc: validateUser,
          verifyOptions: {algorithms: ['HS256']}
        });
      } catch (err) {
        throw new Error(err);
      }
    },
    info: () => {
      return {
        name: "JWT Authentication",
        version: "1.0.0"
      };
    }
  };
};


