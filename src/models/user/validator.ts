import * as Joi from 'joi'
import Roles from '../roles/interface'

const Model = Joi.object().keys({
  _id: Joi.string().regex(/[0-9a-z]{24}/g).required().description('Unique ID of user entity'),
  isActive: Joi.boolean().required().description('User login using for authorization'),
  login: Joi.string().min(1).required().description('User login using for authorization'),
  roles: Joi.array().min(1).items(Roles.toArray()).required().description('User roles list for accessing to backend application'),
  token: Joi.string().optional().description('JWT auth token for detecting authorized user'),
  createdAt: Joi.string().isoDate().optional().description('Date when user record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when user record was updated last time'),
  __v: Joi.number().optional().description('Version of current entity record')
})
  .unknown(false)
  .label('IUser')
  .description('Detailed user information')
  .example({
    '_id': '59eef4f909225626a7fb0b7f',
    'isActive': true,
    'login': 'admin',
    'roles': ['administrator'],
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMWJmZDBmYzc2OGVlNjVlYzQ3NzVjYiIsImlhdCI6MTUxMTg2MDM2M30.NkQOr1mKxuShtOm5oZ5EZWrYvdL5lFzmWZVV2DfXqMw',
    'createdAt': '2017-11-27T11:09:15.463Z',
    'updatedAt': '2017-11-27T11:09:15.463Z',
    '__v': 0
  })

const Payload = Joi.object().keys({
  isActive: Joi.boolean().required().description('User login using for authorization'),
  login: Joi.string().min(1).required().description('User login using for authorization'),
  password: Joi.string().min(1).optional().description('User password using for authorization'),
  roles: Joi.array().min(1).items(Roles.toArray()).required().description('User roles list for accessing to backend application')
})
  .unknown(false)
  .label('IUserPayload')
  .description('Detailed user information payload')
  .example({
    'isActive': true,
    'login': 'admin',
    'password': 'password123',
    'roles': ['administrator']
  })

export {
  Model,
  Payload
}
