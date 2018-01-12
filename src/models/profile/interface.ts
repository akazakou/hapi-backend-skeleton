import { ITimed } from '../misc/timed'
import * as User from '../user'
import { Document, MongooseDocumentOptionals, Types } from 'mongoose'

/**
 * That interface allow create user profiles
 */
interface Interface extends Document, ITimed, MongooseDocumentOptionals {
  /**
   * The string version of this documents _id
   */
  readonly id: string
  /**
   * User that assigned to this Profile
   */
  user: string | Types.ObjectId | User.Interface
  /**
   * Email of current user profile
   */
  email: string
  /**
   * First name of user profile
   */
  firstName: string
  /**
   * Last name of user profile
   */
  lastName: string
}

export default Interface
