import * as User from '../../models/user'
import { JWTData } from './interface'
import * as Log from '../../services/logs'

// init logger instance
const log = Log.init()

export default async function (decoded: JWTData, request: Request, callback: Function) {
  try {
    const user: User.Interface | null = await User.Model.findById(decoded.sub)

    callback(null, !!user, Object.assign({}, decoded, { user }))
  } catch (error) {
    log.error(`Catch error on JWT Auth token processing`, { decoded })
    callback(error, false, decoded)
  }
}
