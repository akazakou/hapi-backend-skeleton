import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';

/**
 * Access role for system administrator
 */
type TypeRoleAdmin = "administrator";
/**
 * Access role for retailer
 */
type TypeRoleRetailer = "retailer";
/**
 * Access role for registered user
 */
type TypeRoleUser = "user";
/**
 * Access role for unknown user
 */
type TypeRoleUnknown = "unknown";
/**
 * List of available access roles
 */
type TypeUserRoles = TypeRoleAdmin | TypeRoleRetailer | TypeRoleUser | TypeRoleUnknown;

/**
 * Description of user object
 */
interface IUser extends Mongoose.Document, ITimed {
  /**
   * User id
   */
  readonly id: string;
  /**
   * Login will be used for identify user
   */
  login: string;
  /**
   * Password hash for validation of user authorisation
   */
  password: string;
  /**
   * Defined user access role
   */
  role: TypeUserRoles;
}

/**
 * Description of user schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * Login will be used for identify user
   */
  login: {type: Mongoose.SchemaTypes.String, required: true, unique: true},
  /**
   * Password hash for validation of user authorisation
   */
  password: {type: Mongoose.SchemaTypes.String, required: true},
  /**
   * Defined user access role
   */
  role: {type: Mongoose.SchemaTypes.String, required: true},
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true,
});

/**
 * Define virtual ID option for simple accessing to string value
 */
Schema.virtual('id').get(() => {
  return this._id ? this._id.toString() : this._id;
});

/**
 * Database collection object for User entity
 * @type {"mongoose".Model<IUser>}
 */
const User = Mongoose.model<IUser>('User', Schema);

export {
  User,
  IUser,
  TypeRoleAdmin,
  TypeRoleRetailer,
  TypeRoleUser,
  TypeRoleUnknown,
  TypeUserRoles,
}