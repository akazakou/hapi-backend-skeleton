import * as Joi from "joi";

const ObjectId = Joi.string().regex(/[0-9a-z]{24}/g);

const IRetailer = Joi.object().keys({
  _id: Joi.string().regex(/[0-9a-z]{24}/g).optional().description('Unique ID of user entity'),
  isActive: Joi.boolean().required().description('Flag indicates that retailer in active status'),
  user: ObjectId.required().description('User ID that own this retail configuration'),
  brandName: Joi.string().required().description('Brand Name for this retail configuration'),
  logo: ObjectId.required().description('File ID of image for this retail configuration'),
  commercialRecordNumber: Joi.string().required().description('Commercial Record Number for this retail configuration'),
  companyName: Joi.string().required().description('Company Name for this retail configuration'),
  representativeEmail: Joi.string().email().required().description('Representative Email for this retail configuration'),
  representativeMobileNumber: Joi.string().required().description('Representative Mobile Number for this retail configuration'),
  plan: ObjectId.optional().description('Plan ID for this retail configuration'),
  createdAt: Joi.string().isoDate().optional().description('Date when entity record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when entity record was updated last time'),
  __v: Joi.number().optional().description('Version of current entity record'),
})
  .unknown(false)
  .label('IUser')
  .description('Detailed retailer information')
  .example({
    "_id": "59eef4f909225626a7fb0b7f",
    "isActive": true,
    "user": "59eef4f909225626a7fb0b8a",
    "brandName": "some brand name here",
    "logo": "59eef4f909225626a7fb0b8b",
    "commercialRecordNumber": "some commercial record number here",
    "companyName": "some company name here",
    "representativeEmail": "representativeEmail@example.com",
    "representativeMobileNumber": "+12024561111",
    "plan": "59eef4f909225626a7fb0b8c",
    "createdAt": "2017-11-27T11:09:15.463Z",
    "updatedAt": "2017-11-27T11:09:15.463Z",
    "__v": 0,
  });

const IRetailerPayload = Joi.object().keys({
  isActive: Joi.boolean().required().description('Flag indicates that retailer in active status'),
  user: ObjectId.required().description('User ID that own this retail configuration'),
  brandName: Joi.string().required().description('Brand Name for this retail configuration'),
  logo: ObjectId.required().description('File ID of image for this retail configuration'),
  commercialRecordNumber: Joi.string().required().description('Commercial Record Number for this retail configuration'),
  companyName: Joi.string().required().description('Company Name for this retail configuration'),
  representativeEmail: Joi.string().email().required().description('Representative Email for this retail configuration'),
  representativeMobileNumber: Joi.string().required().description('Representative Mobile Number for this retail configuration'),
  plan: ObjectId.optional().description('Plan ID for this retail configuration'),
})
  .unknown(false)
  .label('IUserPayload')
  .description('Detailed retailer information payload')
  .example({
    "isActive": true,
    "user": "59eef4f909225626a7fb0b8a",
    "brandName": "some brand name here",
    "logo": "59eef4f909225626a7fb0b8b",
    "commercialRecordNumber": "some commercial record number here",
    "companyName": "some company name here",
    "representativeEmail": "representativeEmail@example.com",
    "representativeMobileNumber": "+12024561111",
    "plan": "59eef4f909225626a7fb0b8c",
  });

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: IRetailerPayload
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
    payload: IRetailerPayload
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
  IRetailer,
}
