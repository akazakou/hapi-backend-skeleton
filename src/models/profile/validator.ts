import * as Joi from 'joi'

/**
 * Full model definition validator
 * @type {ObjectSchema}
 */
const Model = Joi.object().keys({
  _id: Joi.string().regex(/[0-9a-z]{24}/g).required().description('Unique ID of user entity'),
  email: Joi.string().email().required().description('User profile email address'),
  firstName: Joi.string().min(1).required().description('User profile first name'),
  lastName: Joi.string().min(1).required().description('User profile last name'),
  createdAt: Joi.string().isoDate().optional().description('Date when user record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when user record was updated last time'),
  __v: Joi.number().optional().description('Version of current entity record')
})
  .unknown(false)
  .label('Profile')
  .description('Detailed user profile information')
  .example({
    '_id': '59eef4f909225626a7fb0b7f',
    'email': 'address@example.com',
    'firstName': 'FirstName',
    'lastName': 'LastName',
    'createdAt': '2017-11-27T11:09:15.463Z',
    'updatedAt': '2017-11-27T11:09:15.463Z',
    '__v': 0
  })

/**
 * Payload model definition
 * @type {Joi.ObjectSchema}
 */
const Payload = Joi.object().keys({
  email: Joi.string().email().required().description('User profile email address'),
  firstName: Joi.string().min(1).required().description('User profile first name'),
  lastName: Joi.string().min(1).required().description('User profile last name')
})
  .unknown(false)
  .label('IProfilePayload')
  .description('Payload with detailed user profile information')
  .example({
    'email': 'address@example.com',
    'firstName': 'FirstName',
    'lastName': 'LastName'
  })

export {
  Model,
  Payload
}
