import { model, Model } from 'mongoose'
import { Request } from 'hapi'
import Interface from './interface'
import Schema from './schema'

/**
 * Interface for user schema
 */
export interface IUserSchema extends Model<Interface> {
  /**
   * Parse Hapi request and extract user object from it
   * @param {Request} request
   */
  getUserFromRequest (request: Request): Promise<Interface>
}

/**
 * Database collection object for User entity
 * @type {Mongoose.Model<Interface>}
 */
const User: IUserSchema = model<Interface, IUserSchema>('User', Schema)

export default User
