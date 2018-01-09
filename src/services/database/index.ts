import * as Mongoose from "mongoose";
import * as Log from "../logs";
import * as Config from "../config";

// get config object
const config = Config.init();

// initializing logger instance
const log = Log.init();

export async function init(): Promise<void> {

  (<any>Mongoose).Promise = Promise;

  let connectionString: string = config.get('database:uri');

  try {
    await Mongoose.connect(connectionString, config.get('database:options'));
    log.info(`Connected to database: ${connectionString}`);
  } catch (error) {
    log.error(`Unable to connect to database: ${connectionString}`, error);
  }
}
