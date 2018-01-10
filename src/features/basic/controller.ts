import { ReplyNoContinue, Request, Response } from 'hapi'
import * as Boom from 'boom'
import * as Mongoose from 'mongoose'
import * as Log from '../../services/logs'
import { ITimed } from '../../models/misc/timed'

/**
 * Interface for working with model data
 */
interface IBasicModel extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * String version of document ID value
   */
  readonly id: string
}

/**
 * Initialization of logger instance
 * @type {winston.LoggerInstance}
 */
const log = Log.init()

export default class BasicController<T extends IBasicModel> {
  /**
   * Model, that should be used for CRUD operations
   */
  protected model: Mongoose.Model<T>

  /**
   * Constructor of basic CRUD controller class
   * @param {"mongoose".Schema} model
   */
  public constructor (model: Mongoose.Model<T>) {
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
      reply(await this.model.findById(request.params.id))
    } catch (err) {
      log.error(err)
      reply(Boom.badImplementation(err.message, err))
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

      reply(await dbRequest)
    } catch (err) {
      log.error(err)
      reply(Boom.badImplementation(err.message, err))
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
      let model: T = new this.model(request.payload)
      reply(model.save()).code(201)
    } catch (err) {
      log.error(err)
      reply(Boom.badImplementation(err.message, err))
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
      let model: T | null = await this.model.findById(request.params.id)

      if (!model) {
        return reply(Boom.badData(`Can't find model ${this.model.constructor.name} with ID ${request.params.id}`))
      }

      for (let key in request.payload) {
        if (request.payload.hasOwnProperty(key)) {
          model.set(key, request.payload[key])
          model.markModified(key)
        }
      }

      reply(await model.save())
    } catch (err) {
      log.error(err)
      reply(Boom.badImplementation(err.message, err))
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
      let model: T | null = await this.model.findById(request.params.id)

      if (!model) {
        return reply(Boom.badData(`Can't find model ${this.model.constructor.name} with ID ${request.params.id}`))
      }

      await model.remove()

      reply(model)
    } catch (err) {
      log.error(err)
      reply(Boom.badImplementation(err.message, err))
    }
  }
}
