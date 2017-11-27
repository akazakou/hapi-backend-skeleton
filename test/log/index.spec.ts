import {expect} from 'chai';
import * as Log from "../../src/log"

describe('Logs', () => {
    it('should initialize logs correctly', done => {
      let logs = Log.init();

      // expect existing of functions for logging
      expect(logs).to.include.keys(['warn', 'info', 'error', 'debug']);
      // expect that key should be a function
      expect(logs.warn).a('function');
      done();
    });
});

