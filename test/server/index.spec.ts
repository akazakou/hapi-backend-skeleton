import {expect} from 'chai';
import * as sinon from 'sinon';
import * as Server from "../../src/services/server"

describe('Server', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  /*
  it('should initialize server object correctly', done => {
    sandbox.stub(TaskerService, 'init').returns(true);
    let server = Server.init();
    expect(server.start).a('function');
    done();
  });
  */
});

