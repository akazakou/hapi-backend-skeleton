import * as Joi from "joi";

const ObjectId = Joi.string().regex(/[0-9a-z]{24}/g);

const IOffer = Joi.object().keys({
  _id: Joi.string().regex(/[0-9a-z]{24}/g).optional().description('Unique ID of user entity'),
  title: Joi.string().required().description("Title of offer"),
  retailer: ObjectId.required().description("ID of retailer, who own that offer"),
  campaignStartDate: Joi.string().isoDate().optional().description("Starting date of current offer"),
  campaignEndDate: Joi.string().isoDate().optional().description("End date of current offer"),
  branches: Joi.array().items(ObjectId.required().min(1).required().description('ID of branch entity')).min(1).description('List of branches available for that offer'),
  createdAt: Joi.string().isoDate().optional().description('Date when entity record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when entity record was updated last time'),
  __v: Joi.number().optional().description('Version of current entity record'),
})
  .unknown(false)
  .label('IOffer')
  .description('Detailed offer information')
  .example({
    "_id": "59eef4f909225626a7fb0b7f",
    "title": "some title here",
    "retailer": "59eef4f909225626a7fb0b8b",
    "campaignStartDate": "2017-11-27T11:09:15.463Z",
    "campaignEndDate": "2017-11-27T11:09:15.463Z",
    "branches": [
      "59eef4f909225626a7fb0b8a",
      "59eef4f909225626a7fb0b8b",
      "59eef4f909225626a7fb0b8c",
      "59eef4f909225626a7fb0b8d",
      "59eef4f909225626a7fb0b8e",
      "59eef4f909225626a7fb0b8f",
    ],
    "createdAt": "2017-11-27T11:09:15.463Z",
    "updatedAt": "2017-11-27T11:09:15.463Z",
    "__v": 0,
  });

const IOfferPayload = Joi.object().keys({
  title: Joi.string().required().description("Title of offer"),
  retailer: ObjectId.required().description("ID of retailer, who own that offer"),
  campaignStartDate: Joi.string().isoDate().optional().description("Starting date of current offer"),
  campaignEndDate: Joi.string().isoDate().optional().description("End date of current offer"),
  branches: Joi.array().items(ObjectId.required().description('ID of branch entity')).min(1).required().description('List of branches available for that offer'),
})
  .unknown(false)
  .label('IOfferPayload')
  .description('Detailed offer payload information')
  .example({
    "title": "some title here",
    "retailer": "59eef4f909225626a7fb0b8b",
    "campaignStartDate": "2017-11-27T11:09:15.463Z",
    "campaignEndDate": "2017-11-27T11:09:15.463Z",
    "branches": [
      "59eef4f909225626a7fb0b8a",
      "59eef4f909225626a7fb0b8b",
      "59eef4f909225626a7fb0b8c",
      "59eef4f909225626a7fb0b8d",
      "59eef4f909225626a7fb0b8e",
      "59eef4f909225626a7fb0b8f",
    ],
  });

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: IOfferPayload
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
    payload: IOfferPayload
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
  IOffer,
}
