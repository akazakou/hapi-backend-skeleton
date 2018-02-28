import * as User from '../../models/user'
import { JWTData } from './interface'
import { Request } from 'hapi'

export default async function (decoded: JWTData, request: Request) {
  // check is the request have authorization information
  if (!request.headers || !request.headers.authorization) {
    return {
      isValid: false,
      credentials: decoded
    }
  }

  // try to find user with requested data
  const user: User.Interface | null = await User.Model.findOne({
    _id: decoded.sub,
    token: request.headers.authorization,
  })

  // generate validation response
  return {
    isValid: !!user,
    credentials: Object.assign({}, decoded, {user})
  }
}
