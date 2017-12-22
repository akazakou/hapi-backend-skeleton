import * as Joi from "joi";

const AuthToken = Joi.string().required().description('JWT auth token for detecting authorized user');

const HTTPError = Joi.object().keys({
  statusCode: Joi.number().required().description('Code of current error'),
  error: Joi.string().required().description('Type description of error'),
  message: Joi.string().required().description('Message with description of error'),
}).label('HTTP_ERROR');

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

const modelList = {
  validate: {
    headers: Joi.object().keys({
      Authorization: AuthToken,
    }).unknown(true),
  },

  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving list of all matching models for query',
      'schema': Joi.array().items(Joi.any())
        .label('Array<any>')
        .example([{
            "_id": "59eef4f909225626a7fb0b7f",
          }]
        ),
    }
  }),
};

const Documentation = {
  "list": modelList,
};

export {
  Documentation
}
