import BasicController from "../basic/controller";
import {IProfile, Profile} from "../../models/profile";

/**
 * That controller provides CRUD functionality for user profile
 */
export default class ProfileController extends BasicController<IProfile> {
  public constructor() {
    super(Profile);
  }
}
