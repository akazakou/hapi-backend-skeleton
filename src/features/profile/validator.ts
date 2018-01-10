import * as Joi from 'joi'
import * as Profile from '../../models/profile'

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: "joi".ObjectSchema}}
 */
const Validator = {
  create: {
    payload: Profile.Validator.Payload
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration')
    },
    payload: Profile.Validator.Payload
  }
}

export {
  Validator
}
