import {expect} from 'chai';
import * as sinon from 'sinon';
import * as Server from "../../../src/services/server/index"

describe('Server', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });
});

