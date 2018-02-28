import * as User from '../../models/user'
import { AuthData } from '../../plugins/jwt-auth/interface'

/**
 * Request that contains data for authorized user
 */
interface AuthorizedRequest extends Request {
  auth: {
    credentials: AuthData
  }
}

/**
 * Request to create a new user
 */
interface CreateUserRequest extends AuthorizedRequest {
  payload: User.Interface;
}

/**
 * Request to update existed user
 */
interface UpdateUserRequest extends CreateUserRequest {
  params: {
    id: string;
  }
}

/**
 * Request to logout authorized user
 */
interface LoginUserRequest extends AuthorizedRequest {
  payload: {
    login: string;
    password: string;
  }
}

export {
  AuthorizedRequest,
  CreateUserRequest,
  UpdateUserRequest,
  LoginUserRequest,
}
