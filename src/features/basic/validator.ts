import * as Joi from "joi";

const IListPayload = Joi.object({
  query: Joi.object({}).unknown(true).optional().description('Mongoose query object for selecting documents from database'),
  fields: Joi.object({}).unknown(true).optional().description('List of fields from model that should be selected11'),
  sort: Joi.object({}).unknown(true).optional().description('Sorting rules for current model'),
  skip: Joi.number().optional().description('Skip some number of selected records'),
  limit: Joi.number().optional().description('Limitation of output records'),
}).optional().description('Request to receive list of models list');

/**
 * Validator object that contains all validation rules for HTTP requests
 * @type {{create: ObjectSchema}}
 */
const Validator = {
  create: {
    payload: Joi.object().unknown(true).required().description('Model object payload'),
  },
  update: {
    params: {
      id: Joi.string().required().description('Internal ID of current client configuration'),
    },
    payload: Joi.object().unknown(true).required().description('Model object payload'),
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
    payload: IListPayload,
  },
};

export {
  Validator,
}
