import * as Joi from "joi";
import {IOffer} from "./validator";

const BearerToken = Joi.string().required().description('Bearer token for detecting authorized user');

const HTTPError = Joi.object().keys({
  statusCode: Joi.number().required().description('Code of current error'),
  error: Joi.string().required().description('Type description of error'),
  message: Joi.string().required().description('Message with description of error'),
})
  .label('HTTP_ERROR');

const BasicErrors = {
  '400': {
    'description': 'You have an error in request parameters.',
    'label': 'HTTP_BAD_REQUEST',
    'schema': HTTPError.example({
      "statusCode": 400,
      "error": "Bad Request",
      "message": "Can't find template with ID 35"
    }),
  },
  '401': {
    'description': 'User does not have authorization.',
    'label': 'HTTP_NOT_UNAUTHORIZED',
    'schema': HTTPError.example({
      "statusCode": 401,
      "error": "Unauthorized",
      "message": "Missing authentication"
    }),
  },
  '403': {
    'description': 'An internal server error occurred.',
    'label': 'HTTP_FORBIDDEN',
    'schema': HTTPError.example({
      "statusCode": 403,
      "error": "Forbidden",
      "message": "You don't have access to the route /user/{id}"
    }),
  },
  '500': {
    'description': 'An internal server error occurred.',
    'label': 'HTTP_INTERNAL_SERVER_ERROR',
    'schema': HTTPError.example({
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "An internal server error occurred"
    }),
  },
};

const offerList = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving list of all available branches',
      'schema': Joi.array().items(IOffer)
        .label('Array<IOffer>')
        .example([{
          "_id": "59eef4f909225626a7fb0b7f",
          "title": "some title here",
          "retailer": "59eef4f909225626a7fb0b8b",
          "campaignStartDate": "2017-11-27T11:09:15.463Z",
          "campaignEndDate": "2017-11-27T11:09:15.463Z",
          "branches": [
            "59eef4f909225626a7fb0b8a",
            "59eef4f909225626a7fb0b8b",
            "59eef4f909225626a7fb0b8c",
            "59eef4f909225626a7fb0b8d",
            "59eef4f909225626a7fb0b8e",
            "59eef4f909225626a7fb0b8f",
          ],
          "createdAt": "2017-11-27T11:09:15.463Z",
          "updatedAt": "2017-11-27T11:09:15.463Z",
          "__v": 0,
        }]),
    }
  }),
};

const offerCreate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '201': {
      'description': 'Report about success branch creation with full branch configuration data',
      'schema': IOffer,
    },
    '422': {
      'description': 'Report about wrong data for creating new branch configuration',
      'schema': HTTPError.example({
        "statusCode": 422,
        "error": "Unprocessable Entity",
        "message": 'This plan does not exists in database'
      }),
    }
  }),
};

const offerUpdate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success branch configuration data update',
      'schema': IOffer,
    },
    '422': {
      'description': 'Report about wrong data for updating existed branch',
      'schema': HTTPError.example({
        "statusCode": 422,
        "error": "Unprocessable Entity",
        "message": 'This plan does not exists'
      }),
    },
  }),
};

const offerDelete = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success branch configuration data deletion',
      'schema': IOffer,
    }
  }),
};

const offerGet = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving detailed object description by ID',
      'schema': IOffer,
    }
  }),
};

const Documentation = {
  "create": offerCreate,
  "update": offerUpdate,
  "delete": offerDelete,
  "get": offerGet,
  "list": offerList,
};

export {
  Documentation
}
