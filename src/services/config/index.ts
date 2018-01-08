import * as nconf from "nconf";

const defaults = {
  "server": {
    "port": 3000,
    "auth": {
      "jwt": {
        "active": true,
        "jwtSecret": "change me"
      }
    },
    "plugins": [
      "graphql",
      "jwt-auth",
      "swagger",
      "logs",
      "roles"
    ]
  },
  "database": {
    "uri": "mongodb://default:27017/candle-backend",
    "options": {
      "useMongoClient": true,
      "autoIndex": true,
      "reconnectInterval": 500,
      "poolSize": 10,
      "bufferMaxEntries": 0
    }
  },
  "log": {
    "level": "debug",
    "json": false,
    "showLevel": true,
    "timestamp": true,
    "colorize": true,
    "exitOnError": false,
    "handleExceptions": true,
    "humanReadableUnhandledException": true
  }
};

/**
 * Prepare configuration for next using
 * @returns {Provider}
 */
function init(): nconf.Provider {
  nconf.argv()
    .env({separator:'__'})
    .file({file: __dirname + '/../../../../config.json'})
    .defaults(defaults)
    .overrides({ always: 'be this value'});

  return nconf;
}

export {
  init,
}
