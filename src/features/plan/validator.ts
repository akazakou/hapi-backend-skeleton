import * as Joi from "joi";

const ObjectId = Joi.string().regex(/[0-9a-z]{24}/g);

const IPlan = Joi.object().keys({
  _id: Joi.string().regex(/[0-9a-z]{24}/g).optional().description('Unique ID of user entity'),
  name: Joi.string().required().description("Name for displaying plan"),
  maximumNumberOfBranches: Joi.number().min(1).required().description('Maximum Number Of Branches limit per plan'),
  maximumNumberOfOffers: Joi.number().min(1).required().description('Maximum Number Of Offers limit per plan'),
  createdAt: Joi.string().isoDate().optional().description('Date when entity record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when entity record was updated last time'),
  __v: Joi.number().optional().description('Version of current entity record'),
})
  .unknown(false)
  .label('IPlan')
  .description('Detailed plan information')
  .example({
    "_id": "59eef4f909225626a7fb0b7f",
    "name": "some name here",
    "maximumNumberOfBranches": 50,
    "maximumNumberOfOffers": 150,
    "createdAt": "2017-11-27T11:09:15.463Z",
    "updatedAt": "2017-11-27T11:09:15.463Z",
    "__v": 0,
  });

const IPlanPayload = Joi.object().keys({
  name: Joi.string().required().description("Name for displaying plan"),
  maximumNumberOfBranches: Joi.number().min(1).required().description('Maximum Number Of Branches limit per plan'),
  maximumNumberOfOffers: Joi.number().min(1).required().description('Maximum Number Of Offers limit per plan'),
})
  .unknown(false)
  .label('IPlanPayload')
  .description('Detailed plan information')
  .example({
    "name": "some name here",
    "maximumNumberOfBranches": 50,
    "maximumNumberOfOffers": 150,
  });


/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: IPlanPayload
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
    payload: IPlanPayload
  },
  delete: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
  },
  get: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
  },
  list: {
  },
};

export {
  Validator,
  IPlan,
}
