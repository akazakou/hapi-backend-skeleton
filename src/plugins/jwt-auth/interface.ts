import * as User from '../../models/user'

/**
 * Interface that describes an decoded object structure, assigned to key
 */
interface JWTData {
  /**
   * Identifier (or, name) of the server or system issuing the token. Typically a DNS name, but doesn't have to be.
   */
  iss: string
  /**
   * Date/time when the token was issued. (defaults to now)
   */
  iat: number
  /**
   * Date/time at which point the token is no longer valid. (defaults to one year from now)
   */
  exp: number
  /**
   * Intended recipient of this token; can be any string, as long as the other end uses the same string when validating the token. Typically a DNS name.
   */
  aud: string
  /**
   * Identifier (or, name) of the user this token represents
   */
  sub: string
}

/**
 * Description of authorisation credentials from JWT auth plugin
 */
interface AuthData extends JWTData {
  /**
   * Initialised model of currently logged on user
   */
  user: User.Interface
}

interface AuthRequest extends Request {

}

export {
  JWTData,
  AuthData,
}
