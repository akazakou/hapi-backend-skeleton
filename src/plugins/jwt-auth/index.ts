import {IPlugin} from "../interfaces";
import * as Hapi from "hapi";
import {User} from "../../models/user/user";
import * as Config from "../../services/config";
import * as Log from "../../services/log";
import * as HapiAuthJWT2 from "hapi-auth-jwt2";


// loading configuration
const config = Config.init();

const log = Log.init();

export default (): IPlugin => {
  return {
    register: async (server: Hapi.Server): Promise<void> => {
      const validateUser = (decoded, request, cb) => {
        if (!config.get("server:auth:jwt:active")) {
          return User.findOne({});
        }

        User.findById(decoded.id).then((user) => {
          if (user && user.token) {
            return cb(null, true);
          }

          return cb(null, false);
        });
      };

      try {
        const toggle = config.get("server:auth:jwt:active") ? 'required' : false;

        await server.register({register: HapiAuthJWT2});

        server.auth.strategy('jwt', 'jwt', toggle, {
          key: config.get("server:auth:jwt:jwtSecret"),
          validateFunc: validateUser,
          verifyOptions: {algorithms: ['HS256']}
        });

      } catch (err) {
        log.error(`Catch error on token validation: ${err.message}`, {err});
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
