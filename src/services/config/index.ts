import * as nconf from "nconf";

/**
 * Prepare configuration for next using
 * @returns {Provider}
 */
function init(): nconf.Provider {
  return nconf
    .file('custom', {file: __dirname + '/../../../config.json'}) // loading overloaded parameters
    .file({file: __dirname + '/default.json'}) // loading default parameters
    .env() // getting environment parameters
    .argv(); // getting argv parameters
}

export {
  init,
}