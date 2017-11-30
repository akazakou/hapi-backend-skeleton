import * as Joi from "joi";

const ObjectId = Joi.string().regex(/[0-9a-z]{24}/g);

const IGeoJSON = Joi.object().keys({
  type: Joi.string().only(['Point']).required().description("Type of coordinates for branch"),
  location: Joi.array().items(Joi.number()).min(2).max(2).required().description("Latitude and Longitude of branch position"),
})
  .unknown(false)
  .label('IGeoJSON')
  .description('Coordinates description for branch')
  .example({
    "type": "Point",
    "location": [53.927766, 27.683593],
  });

const IBranch = Joi.object().keys({
  _id: Joi.string().regex(/[0-9a-z]{24}/g).optional().description('Unique ID of user entity'),
  name: Joi.string().required().description("Name for displaying branch"),
  retailer: ObjectId.required().description("ID of retailer, who own that branch"),
  location: IGeoJSON.required().description("Coordinates description for branch"),
  createdAt: Joi.string().isoDate().optional().description('Date when entity record was created'),
  updatedAt: Joi.string().isoDate().optional().description('Date when entity record was updated last time'),
  __v: Joi.number().optional().description('Version of current entity record'),
})
  .unknown(false)
  .label('IUser')
  .description('Detailed retailer information')
  .example({
    "_id": "59eef4f909225626a7fb0b7f",
    "name": "some name here",
    "retailer": "59eef4f909225626a7fb0b8b",
    "location": {
      "type": "Point",
      "location": [53.927766, 27.683593],
    },
    "createdAt": "2017-11-27T11:09:15.463Z",
    "updatedAt": "2017-11-27T11:09:15.463Z",
    "__v": 0,
  });

const IBranchPayload = Joi.object().keys({
  name: Joi.string().required().description("Name for displaying branch"),
  retailer: ObjectId.required().description("ID of retailer, who own that branch"),
  location: IGeoJSON.required().description("Coordinates description for branch"),
})
  .unknown(false)
  .label('IUser')
  .description('Detailed retailer information')
  .example({
    "name": "some name here",
    "retailer": "59eef4f909225626a7fb0b8b",
    "location": {
      "type": "Point",
      "location": [53.927766, 27.683593],
    },
  });

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: IBranchPayload
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
    payload: IBranchPayload
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
  IBranch,
}
