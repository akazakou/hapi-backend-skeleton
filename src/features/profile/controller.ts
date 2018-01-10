import BasicController from '../basic/controller'
import { Interface, Model } from '../../models/profile'

/**
 * That controller provides CRUD functionality for user profile
 */
export default class ProfileController extends BasicController<Interface> {
  public constructor () {
    super(Model)
  }
}
