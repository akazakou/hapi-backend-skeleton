// assign basedir property to global variables list
global.__basedir = `${__dirname}/../..`

// setting EventEmitter maxListeners
require('events').EventEmitter.defaultMaxListeners = 100

import { Server as HapiServer } from 'hapi'
import * as Server from './services/server'
import * as Log from './services/logs'
import * as Database from './services/database'

// initializing logger instance
const log = Log.init()

// reporting about uncaught exception
process.on('uncaughtException', (error: Error) => {
  log.warn(`Detect uncaughtException: ${error.toString()}`, {error})
})

/**
 * Initialize HTTP server for processing requests
 * @returns {Promise<Server | null>}
 */
async function init (): Promise<HapiServer | null> {

  try {
    // waiting database connection
    await Database.init()

    const server: HapiServer | null = await Server.init()

    if (server && server.info && server.info.uri) {
      await server.start()
      log.info(`Server running at: ${server.info.uri}`)
    } else {
      log.error(`Server doesn't initialized`)
    }

    return server
  } catch (error) {
    log.error(`Can't start server\n${error.stack}`, {error})
  }

  return null
}

init()
