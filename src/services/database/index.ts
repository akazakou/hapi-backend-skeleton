import * as Mongoose from "mongoose";
import * as Log from "../log";
import * as Config from "../config/index";

// get config object
const config = Config.init();

// initializing logger instance
const log = Log.init();

export function init(): Promise<Mongoose.Connection> {
  return new Promise((resolve, reject) => {
    (<any>Mongoose).Promise = Promise;

    let connectionString: string = config.get('database:uri');
    let connection = Mongoose.createConnection(connectionString, config.get('database:options'));
    connection.once('open', () => {
      log.info(`Connected to database: ${connectionString}`);
      resolve(connection);
    });
    connection.once('error', (error) => {
      log.error(`Unable to connect to database: ${connectionString}`);
      reject(error);
    });
  });
}
