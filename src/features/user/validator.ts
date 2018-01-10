import * as Joi from 'joi'
import * as User from '../../models/user'

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: User.Validator.Payload
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration')
    },
    payload: User.Validator.Payload
  },
  delete: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration')
    }
  },
  get: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration')
    }
  },
  list: {},
  login: {
    payload: {
      login: Joi.string().min(1).required().description('User login using for authorization'),
      password: Joi.string().min(1).optional().description('User password using for authorization')
    }
  },
  logout: {},
  auth: {}
}

export {
  Validator
}
