import * as Joi from "joi";
import {IUser} from "./validator";

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
  '500': {
    'description': 'An internal server error occurred.',
    'label': 'HTTP_INTERNAL_SERVER_ERROR',
    'schema': HTTPError.example({
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "An internal server error occurred"
    }),
  }
};

const userList = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving list of all available users',
      'schema': Joi.array().items(IUser)
        .label('Array<IUser>')
        .example([{
            "_id": "59eef4f909225626a7fb0b7f",
            "login": "admin",
            "password": "password123",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMWJmZDBmYzc2OGVlNjVlYzQ3NzVjYiIsImlhdCI6MTUxMTg2MDM2M30.NkQOr1mKxuShtOm5oZ5EZWrYvdL5lFzmWZVV2DfXqMw",
            "createdAt": "2017-11-27T11:09:15.463Z",
            "updatedAt": "2017-11-27T11:09:15.463Z",
          }]
        ),
    }
  }),
};

const userCreate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '201': {
      'description': 'Report about success user creation with full user configuration data',
      'schema': IUser,
    }
  }),
};

const userUpdate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success user configuration data update',
      'schema': IUser,
    }
  }),
};

const userDelete = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success user configuration data deletion',
      'schema': IUser,
    }
  }),
};

const userGet = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving detailed object description by ID',
      'schema': IUser,
    }
  }),
};

const userLogin = {
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Validate login and password success',
      'schema': IUser,
    },
    '400': {
      'description': 'Wrong username or password',
      'schema': HTTPError.example({
        "statusCode": 401,
        "error": "Unauthorized",
        "message": "Password is invalid"
      }),
    },
  }),
};

const userLogout = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Validate login and password success',
      'schema': IUser,
    }
  }),
};

const userAuth = {
  validate: {
    headers: Joi.object().keys({
      Authorization: BearerToken,
    }).unknown(true),
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Validate login and password success',
      'schema': IUser,
    }
  }),
};

const Documentation = {
  "create": userCreate,
  "update": userUpdate,
  "delete": userDelete,
  "get": userGet,
  "list": userList,
  "login": userLogin,
  "logout": userLogout,
  "auth": userAuth,
};

export {
  Documentation
}
