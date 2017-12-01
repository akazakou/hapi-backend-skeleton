import {init as Config} from "../build/src/services/config";
import path from "path";
import child from "child_process";
import mongodbUri from "mongodb-uri";

const config = Config();

export async function up() {
  const backupDirectory = path.join(__dirname, path.basename(__filename).replace('.js', ''));
  const uri = mongodbUri.parse(config.get('database:uri'));
  let command = `mongorestore`;

  command += uri.hosts[0] ? ` --host ${uri.hosts[0].host}:${uri.hosts[0].port}` : '';
  command += uri.username ? ` --username ${uri.username}` : '';
  command += uri.password ? ` --password ${uri.password}` : '';
  command += uri.database ? ` --db ${uri.database}` : '';
  command += ` ${backupDirectory}`;

  console.log(`Try to execute command: ${command}`);

  child.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
    } else {
      console.log(stdout);
    }
  });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down() {
}
