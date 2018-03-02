import * as Config from '../config'
import * as Log from '../logs'
import * as Hapi from 'hapi'
import { Server } from 'hapi'
import { IPlugin } from '../../plugins/interfaces'
import UserFeature from '../../features/user'
import ProfileFeature from '../../features/profile'

const logger = Log.init()

export class Feature {
  constructor (protected server: Hapi.Server, protected routes: Function) {
  }

  init () {
    this.routes(this.server)
  }
}

/**
 * Initialization of Hapi HTTP web server
 * @returns {Server}
 */
async function init (): Promise<Server> {
  // loading configuration
  const config = Config.init()

  // initializing server
  let server = new Hapi.Server({
    debug: false,
    port: config.get('server:port')
  })

  //  Setup Hapi Plugins
  const plugins: Array<string> = config.get('server:plugins')
  let promises: Array<Promise<any>> = []
  plugins.forEach((pluginName: string) => {
    let plugin: IPlugin = (require('../../plugins/' + pluginName)).default()
    logger.info(`Register Plugin ${plugin.info().name} v${plugin.info().version}`)
    promises.push(plugin.register(server))
  })

  await Promise.all(promises)

  // Setup Hapi Features
  let features = [
    {routes: UserFeature, label: 'User'},
    {routes: ProfileFeature, label: 'Profile'}
  ]
  let instances: Feature[] = []
  features.forEach(f => {
    instances.push(new Feature(server, f.routes))
  })
  instances.forEach(instance => instance.init())
  logger.info(`Features: ${features.map(f => '[' + f.label + ']').join(', ')}`)

  return server
}

export {
  init
}
