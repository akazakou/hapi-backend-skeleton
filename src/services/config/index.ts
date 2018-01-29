import * as nconf from 'nconf'

const defaults = {
  'server': {
    'title': 'Backend Node #1',
    'port': 3000,
    'url': 'http://localhost:3000',
    'auth': {
      'jwt': {
        'expireIn': 86400,
        'privateKey': '3Ust0R0z9aekHi2n54TTL2edk+888TCYBYcPDw1PmrHDulFh4/3euNYmsqu7s+cJyIPY3xWD8AnFzNRP747OGorAt0A20qpPeFeHKGTQ11CsXHpsEh1YWZ3RG+LKEbBWK0jU6gMYe0msDVzTcORFKH48RK7Gmpf5NAL152dJOWys34E30i7UC4PZ1+vJJbP6s12+nHUInA26S7E7FBCFpM1/oeF+gStSHi9IdXZCyYsIDRkZKAQBCqhoeW4PvMb6wiOMQ10l4xaiFNRfwHnHlOTFROo7hSKLaBP9zGyvx7+gsX+Q5bJjM+TI2gOg88OsK/Ervz+ogWEnpYFC+3WGdw=='
      }
    },
    'plugins': [
      'jwt-auth',
      'swagger',
      'logs',
      'roles'
    ]
  },
  'database': {
    'uri': 'mongodb://database-host:27017/node-backend-skeleton',
    'options': {
      'useMongoClient': true,
      'autoIndex': true,
      'reconnectInterval': 500,
      'poolSize': 10,
      'bufferMaxEntries': 0
    }
  },
  'log': {
    'level': 'debug',
    'json': false,
    'showLevel': true,
    'timestamp': true,
    'colorize': true,
    'exitOnError': false,
    'handleExceptions': true,
    'humanReadableUnhandledException': true
  }
}

/**
 * Singleton configuration object
 */
let config: nconf.Provider

/**
 * Prepare configuration for next using
 * @returns {Provider}
 */
function init (): nconf.Provider {

  if (!config) {
    config = nconf.argv()
      .env({ separator: '__' })
      .file({ file: `${global.__basedir}/config.json` })
      .defaults(defaults)
      .overrides()
  }

  return config
}

export {
  init
}
