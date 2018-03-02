import { Request, ResponseObject, ResponseToolkit } from 'hapi'
import { badData, badImplementation, Boom, notFound } from 'boom'
import { Document, Model, MongooseDocumentOptionals } from 'mongoose'
import * as Log from '../../services/logs'
import { ITimed } from '../../models/misc/timed'
import { ModelListRequest, ModelUpdateRequest } from './request'

/**
 * Interface for working with model data
 */
export interface IBasicModel extends Document, ITimed, MongooseDocumentOptionals {
  /**
   * String version of document ID value
   */
  readonly id: string
}

/**
 * Initialization of logger instance
 */
const log = Log.init()

export default class BasicController<ModelType extends IBasicModel> {
  /**
   * Model, that should be used for CRUD operations
   */
  protected model: Model<ModelType>

  /**
   * Constructor of basic CRUD controller class
   * @param {Model} model
   */
  public constructor (model: Model<ModelType>) {
    this.model = model
  }

  /**
   * Get one full described model object by model ID parameter
   * @param {Request} request
   * @param {ResponseToolkit} reply
   * @returns {Promise<ResponseObject| Boom>}
   */
  public async getModel (request: Request, reply: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const result: ModelType | null = await this.model.findById(request.params.id)
      if (!result) {
        return notFound(`Model with ID ${request.params.id} are not found`)
      }

      return reply.response(result)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Receive list of models, based on query and fields parameters
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<ResponseObject| Boom>}
   */
  public async getList (request: ModelListRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      const query = request.payload.query ? request.payload.query : {}
      const fields = request.payload.fields ? request.payload.fields : {_id: 1}

      // make a query for extract list of object records
      let dbRequest = this.model.find(query, fields)

      // skip records
      if (request.payload.skip) {
        dbRequest.skip(request.payload.skip)
      }

      // limit records
      if (request.payload.limit) {
        dbRequest.limit(request.payload.limit)
      }

      // sort records
      if (request.payload.sort) {
        dbRequest.sort(request.payload.sort)
      }

      const result = await dbRequest.exec()

      return toolkit.response(result)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Create new model in database
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<ResponseObject| Boom>}
   */
  public async createModel (request: Request, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let model: ModelType = new this.model(request.payload)
      const result: ModelType = await model.save()
      return toolkit.response(result).code(201)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Update existing model based by ID
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<ResponseObject| Boom>}
   */
  public async updateModel (request: ModelUpdateRequest, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let model: ModelType | null = await this.model.findById(request.params.id)

      if (!model) {
        return badData(`Can't find model ${this.model.constructor.name} with ID ${request.params.id}`)
      }

      for (let key in request.payload) {
        model.set(key, request.payload[key])
        model.markModified(key)
      }

      const response: ModelType | null = await model.save()

      return toolkit.response(response)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }

  /**
   * Delete model from database
   * @param {Request} request
   * @param {ResponseToolkit} toolkit
   * @returns {Promise<ResponseObject| Boom>}
   */
  public async deleteModel (request: Request, toolkit: ResponseToolkit): Promise<ResponseObject | Boom> {
    try {
      let model: ModelType | null = await this.model.findById(request.params.id)

      if (!model) {
        return badData(`Can't find model ${this.model.constructor.name} with ID ${request.params.id}`)
      }

      await model.remove()

      return toolkit.response(model)
    } catch (error) {
      log.error(error.message, {error})
      return badImplementation(error.message, {error})
    }
  }
}
