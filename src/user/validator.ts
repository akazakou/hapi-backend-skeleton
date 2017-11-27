import * as Joi from "joi";

const IUser = Joi.object().keys({
  id: Joi.number().required().description('Unique ID of user entity'),
  login: Joi.string().min(1).required().description('User login using for authorization'),
  password: Joi.string().min(1).optional().description('User password using for authorization'),
  createdAt: Joi.string().isoDate().optional().description('Date when user record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when user record was updated last time'),
})
  .unknown(false)
  .label('IUser')
  .description('Detailed user information')
  .example({
    "id": "59eef4f909225626a7fb0b7f",
    "login": "admin",
    "password": "password123",
    "createdAt": "2017-11-27T11:09:15.463Z",
    "updatedAt": "2017-11-27T11:09:15.463Z",
  });

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: IUser
  },
  update: {
    params: {
      id: Joi.number().required().description('Internal ID of current client configuration'),
    },
    payload: IUser
  },
  delete: {
    params: {
      id: Joi.number().required().description('Internal ID of current client configuration'),
    },
  },
  get: {
    params: {
      id: Joi.number().required().description('Internal ID of current client configuration'),
    },
  },
  list: {
  },
};

export {
  Validator,
  IUser,
}
