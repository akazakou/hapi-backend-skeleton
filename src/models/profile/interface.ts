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
   * Flag that indicates the user is active or not
   * Disabled user can't login
   */
  isActive: boolean
  /**
   * Login will be used for identify user
   */
  login: string
  /**
   * Password hash for validation of user authorisation
   * Default password: password123 / $2a$08$t/BCmqpB7IqiLrs627abBugo9BGHv3cCEvfFas52dxH5b6byBGNZ.
   */
  password: string
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

  /**
   * Method for validating user password
   * @param {string} requestPassword
   * @returns {boolean}
   */
  validatePassword (requestPassword: string): boolean
}

export default Interface
