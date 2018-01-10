import { model, Model } from 'mongoose'
import { Request } from 'hapi'
import Interface from './interface'
import Schema from './schema'
import IUser from '../../models/user/interface'

/**
 * Interface for user schema
 */
interface IUserSchema extends Model<Interface> {
  /**
   * Parse Hapi request and extract user object from it
   * @param {Request} request
   * @returns {Promise<IUser>}
   */
  getUserFromRequest (request: Request): Promise<Interface>
}

/**
 * Database collection object for User entity
 * @type {Mongoose.Model<IUser>}
 */
const User: IUserSchema = model<Interface, IUserSchema>('User', Schema)

export default User
