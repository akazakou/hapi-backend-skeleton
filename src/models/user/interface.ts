import { ITimed } from '../misc/timed'
import { TypeRoles } from '../../plugins/roles/interface'
import { Document, MongooseDocumentOptionals } from 'mongoose'

/**
 * Description of user object
 */
interface Interface extends Document, ITimed, MongooseDocumentOptionals {
  /**
   * Virtual getter that by default returns the document's _id field cast to a string,
   * or in the case of ObjectIds, its hexString. This id getter may be disabled by
   * passing the option { id: false } at schema construction time. If disabled, id
   * behaves like any other field on a document and can be assigned any value.
   */
  readonly id: string
  /**
   * JWT Auth token value
   */
  token?: string
  /**
   * Assigned user access roles
   */
  roles: TypeRoles[]
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
   * Generate new access token for user
   * @returns {string}
   */
  generateToken (): string

  /**
   * Method for validating user password
   * @param {string} requestPassword
   * @returns {boolean}
   */
  validatePassword (requestPassword: string): boolean
}

export default Interface
