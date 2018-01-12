import { ITimed } from '../misc/timed'
import { TypeRoles } from '../../plugins/roles/interface'
import { Document, MongooseDocumentOptionals } from 'mongoose'

/**
 * Description of user object
 */
interface Interface extends Document, ITimed, MongooseDocumentOptionals {
  /**
   * JWT Auth token value
   */
  token?: string
  /**
   * Assigned user access roles
   */
  roles: TypeRoles[]

  /**
   * Generate new access token for user
   * @returns {string}
   */
  generateToken (): string
}

export default Interface
