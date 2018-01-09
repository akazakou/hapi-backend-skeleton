import * as Joi from 'joi'
import { IProfile } from './validator'

const AuthToken = Joi.string().required().description('JWT auth token for detecting authorized user')

const HTTPError = Joi.object().keys({
  statusCode: Joi.number().required().description('Code of current error'),
  error: Joi.string().required().description('Type description of error'),
  message: Joi.string().required().description('Message with description of error')
}).label('HTTP_ERROR')

const BasicErrors = {
  '400': {
    'description': 'You have an error in request parameters.',
    'label': 'HTTP_BAD_REQUEST',
    'schema': HTTPError.example({
      'statusCode': 400,
      'error': 'Bad Request',
      'message': 'Can\'t find template with ID 35'
    })
  },
  '401': {
    'description': 'User does not have authorization.',
    'label': 'HTTP_NOT_UNAUTHORIZED',
    'schema': HTTPError.example({
      'statusCode': 401,
      'error': 'Unauthorized',
      'message': 'Missing authentication'
    })
  },
  '403': {
    'description': 'An internal server error occurred.',
    'label': 'HTTP_FORBIDDEN',
    'schema': HTTPError.example({
      'statusCode': 403,
      'error': 'Forbidden',
      'message': 'You don\'t have access to the route /user/{id}'
    })
  },
  '500': {
    'description': 'An internal server error occurred.',
    'label': 'HTTP_INTERNAL_SERVER_ERROR',
    'schema': HTTPError.example({
      'statusCode': 500,
      'error': 'Internal Server Error',
      'message': 'An internal server error occurred'
    })
  }
}

const profileList = {
  validate: {
    headers: Joi.object().keys({
      Authorization: AuthToken
    }).unknown(true)
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving list of all selected user profiles',
      'schema': Joi.array().items(IProfile)
        .label('Array<IUser>')
        .example([
          {
            '_id': '59eef4f909225626a7fb0b7f',
            'email': 'address@example.com',
            'firstName': 'FirstName',
            'lastName': 'LastName',
            'createdAt': '2017-11-27T11:09:15.463Z',
            'updatedAt': '2017-11-27T11:09:15.463Z',
            '__v': 0
          }]
        )
    }
  })
}

const createProfile = {
  validate: {
    headers: Joi.object().keys({
      Authorization: AuthToken
    }).unknown(true)
  },
  responses: Object.assign({}, BasicErrors, {
    '201': {
      'description': 'Report about success user profile creation with full user profile data',
      'schema': IProfile
    },
    '422': {
      'description': 'Report about wrong data for creating new user profile',
      'schema': HTTPError.example({
        'statusCode': 422,
        'error': 'Unprocessable Entity',
        'message': 'User with login "admin" already exists'
      })
    }
  })
}

const profileUpdate = {
  validate: {
    headers: Joi.object().keys({
      Authorization: AuthToken
    }).unknown(true)
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success user profile data update',
      'schema': IProfile
    },
    '422': {
      'description': 'Report about wrong data for updating existed user profile',
      'schema': HTTPError.example({
        'statusCode': 422,
        'error': 'Unprocessable Entity',
        'message': 'User with login "admin" already exists'
      })
    }
  })
}

const profileDelete = {
  validate: {
    headers: Joi.object().keys({
      Authorization: AuthToken
    }).unknown(true)
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Report about success user profile data deletion',
      'schema': IProfile
    }
  })
}

const profileGet = {
  validate: {
    headers: Joi.object().keys({
      Authorization: AuthToken
    }).unknown(true)
  },
  responses: Object.assign({}, BasicErrors, {
    '200': {
      'description': 'Receiving detailed object description by ID',
      'schema': IProfile
    }
  })
}

const Documentation = {
  'create': createProfile,
  'update': profileUpdate,
  'delete': profileDelete,
  'get': profileGet,
  'list': profileList
}

export {
  Documentation
}
