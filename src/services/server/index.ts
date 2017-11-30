import * as Config from "../config/index";
import * as Log from "../log/index";
import * as Hapi from "hapi";
import {IPlugin} from "../../plugins/interfaces";
import UserFeature from "../../features/user/index";
import RetailerFeature from "../../features/retailer/index";
import BranchFeature from "../../features/branch/index";
import OfferFeature from "../../features/offer/index";

const logger = Log.init();

export class Feature {
  constructor(protected server: Hapi.Server, protected routes: Function) {
  }

  init() {
    this.routes(this.server);
  }
}

/**
 * Initialization of Hapi HTTP web server
 * @returns {Podium}
 */
async function init() {
  // loading configuration
  const config = Config.init();

  // initializing server
  let server = new Hapi.Server();

  // establish connection
  server.connection({
    port: config.get("server:port"),
  });

  //  Setup Hapi Plugins
  const plugins: Array<string> = config.get("server:plugins");
  let promises: Array<Promise<any>> = [];
  plugins.forEach((pluginName: string) => {
    let plugin: IPlugin = (require("../../plugins/" + pluginName)).default();
    logger.info(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
    promises.push(plugin.register(server));
  });
  try {
    await Promise.all(promises);
  } catch (err) {
    logger.error('PLUGIN ERROR: ', err);
  }

  // Setup Hapi Features
  let features = [
    {routes: UserFeature, label: 'User'},
    {routes: RetailerFeature, label: 'Retailer'},
    {routes: BranchFeature, label: 'Branch'},
    {routes: OfferFeature, label: 'Offer'},
  ];
  let instances: Feature[] = [];
  features.forEach(f => {
    instances.push(new Feature(server, f.routes));
  });
  instances.forEach(instance => instance.init());
  logger.info(`Features: ${features.map(f => '[' + f.label + ']').join(', ')}`);

  return server;
}

export {
  init
}