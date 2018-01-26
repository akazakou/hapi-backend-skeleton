import { ReplyNoContinue, Request, Response } from 'hapi'
import * as Boom from 'boom'
import { Document, Model, MongooseDocumentOptionals } from 'mongoose'
import * as Log from '../../services/logs'
import { ITimed } from '../../models/misc/timed'
import { LoggerInstance } from 'winston'

/**
 * Interface for working with model data
 */
interface IBasicModel extends Document, ITimed, MongooseDocumentOptionals {
  /**
   * String version of document ID value
   */
  readonly id: string
}

/**
 * Initialization of logger instance
 * @type {LoggerInstance}
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
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void | Response>}
   */
  public async getModel (request: Request, reply: ReplyNoContinue): Promise<void | Response> {
    try {
      const result = await this.model.findById(request.params.id)
      reply(result)
    } catch (error) {
      log.error(error.message, { error })
      reply(Boom.badImplementation(error.message, { error }))
    }
  }

  /**
   * Receive list of models, based on query and fields parameters
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void | Response>}
   */
  public async getList (request: Request, reply: ReplyNoContinue): Promise<void | Response> {
    try {
      const query = request.payload.query ? request.payload.query : {}
      const fields = request.payload.fields ? request.payload.fields : { _id: 1 }

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

      reply(result)
    } catch (error) {
      log.error(error.message, { error })
      reply(Boom.badImplementation(error.message, { error }))
    }
  }

  /**
   * Create new model in database
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void | Response>}
   */
  public async createModel (request: Request, reply: ReplyNoContinue): Promise<void | Response> {
    try {
      let model: ModelType = new this.model(request.payload)
      const result: ModelType = await model.save()
      reply(result).code(201)
    } catch (error) {
      log.error(error.message, { error })
      reply(Boom.badImplementation(error.message, { error }))
    }
  }

  /**
   * Update existing model based by ID
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void | Response>}
   */
  public async updateModel (request: Request, reply: ReplyNoContinue): Promise<void | Response> {
    try {
      let model: ModelType | null = await this.model.findById(request.params.id)

      if (!model) {
        return reply(Boom.badData(`Can't find model ${this.model.constructor.name} with ID ${request.params.id}`))
      }

      for (let key in request.payload) {
        model.set(key, request.payload[key])
        model.markModified(key)
      }

      const response: ModelType | null = await model.save()

      reply(response)
    } catch (error) {
      log.error(error.message, { error })
      reply(Boom.badImplementation(error.message, { error }))
    }
  }

  /**
   * Delete model from database
   * @param {Request} request
   * @param {ReplyNoContinue} reply
   * @returns {Promise<void | Response>}
   */
  public async deleteModel (request: Request, reply: ReplyNoContinue): Promise<void | Response> {
    try {
      let model: ModelType | null = await this.model.findById(request.params.id)

      if (!model) {
        return reply(Boom.badData(`Can't find model ${this.model.constructor.name} with ID ${request.params.id}`))
      }

      await model.remove()

      reply(model)
    } catch (error) {
      log.error(error.message, { error })
      reply(Boom.badImplementation(error.message, { error }))
    }
  }
}
