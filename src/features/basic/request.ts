import * as stream from 'stream'

interface ListPayloadObject {
  query?: object;
  fields?: object;
  skip?: number;
  limit?: number;
  sort?: object;
}

/**
 * Interface that describes data for List models Request
 */
interface ModelListRequest extends Request {
  payload: ListPayloadObject;
}

/**
 * Interface that describes data for Update models Request
 */
interface ModelUpdateRequest extends Request {
  params: {
    id: string,
  }
  payload: {
    [key: string]: stream.Readable | Buffer | string | object;
  };
}

export {
  ModelListRequest,
  ModelUpdateRequest,
}
