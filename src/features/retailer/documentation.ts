import * as Joi from "joi";
import {IRetailer} from "./validator";

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

const retailerList = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving list of all available retailers',
      'schema': Joi.array().items(IRetailer)
        .label('Array<IRetailer>')
        .example([{
            "_id": "59eef4f909225626a7fb0b7f",
            "isActive": true,
            "user": "59eef4f909225626a7fb0b8a",
            "brandName": "some brand name here",
            "logo": "59eef4f909225626a7fb0b8b",
            "commercialRecordNumber": "some commercial record number here",
            "companyName": "some company name here",
            "representativeEmail": "representativeEmail@example.com",
            "representativeMobileNumber": "+12024561111",
            "plan": "59eef4f909225626a7fb0b8c",
            "createdAt": "2017-11-27T11:09:15.463Z",
            "updatedAt": "2017-11-27T11:09:15.463Z",
            "__v": 0,
          }]
        ),
    }
  }),
};

const retailerCreate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '201': {
      'description': 'Report about success retailer creation with full retailer configuration data',
      'schema': IRetailer,
    },
    '422': {
      'description': 'Report about wrong data for creating new retailer configuration',
      'schema': HTTPError.example({
        "statusCode": 422,
        "error": "Unprocessable Entity",
        "message": 'This plan does not exists in database'
      }),
    }
  }),
};

const retailerUpdate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success retailer configuration data update',
      'schema': IRetailer,
    },
    '422': {
      'description': 'Report about wrong data for updating existed retailer',
      'schema': HTTPError.example({
        "statusCode": 422,
        "error": "Unprocessable Entity",
        "message": 'This plan does not exists'
      }),
    },
  }),
};

const retailerDelete = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success retailer configuration data deletion',
      'schema': IRetailer,
    }
  }),
};

const retailerGet = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving detailed object description by ID',
      'schema': IRetailer,
    }
  }),
};

const Documentation = {
  "create": retailerCreate,
  "update": retailerUpdate,
  "delete": retailerDelete,
  "get": retailerGet,
  "list": retailerList,
};

export {
  Documentation
}
