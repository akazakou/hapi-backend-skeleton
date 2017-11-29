import {expect} from 'chai';
import * as Config from "../../src/services/config";

describe('Configuration', () => {
    it('should initialize configuration correctly', done => {
      let config = Config.init().get('server');

      // check existing values from default configuration file
      expect(config).to.include.keys(["port"]);
      done();
    });
});

