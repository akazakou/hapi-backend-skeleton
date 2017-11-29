import * as Mongoose from 'mongoose';
import * as Bcrypt from 'bcrypt';
import {ITimed} from '../misc/timed';
import * as Jwt from 'jsonwebtoken';
import * as Config from "../../services/config";

const config = Config.init();

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
interface IUser extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * Login will be used for identify user
   */
  login: string;
  /**
   * Password hash for validation of user authorisation
   * Default password: password123 / $2a$08$t/BCmqpB7IqiLrs627abBugo9BGHv3cCEvfFas52dxH5b6byBGNZ.
   */
  password: string;
  /**
   * JWT Auth token value
   */
  token?: string;
  /**
   * Defined user access role
   */
  role: TypeUserRoles;

  /**
   * Method for validating user password
   * @param {string} requestPassword
   * @returns {boolean}
   */
  validatePassword(requestPassword: string): boolean;

  /**
   * Generate new access token for user
   * @returns {string}
   */
  generateToken(): string;
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
  /**
   * JWT Auth token value
   */
  token: {type: Mongoose.SchemaTypes.String, required: false},
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true,
});

/**
 * Validate password that was requested on auth method
 * @param {string} requestPassword
 * @returns {any}
 */
Schema.methods.validatePassword = function (requestPassword: string) {
  return Bcrypt.compareSync(requestPassword, this.password);
};

/**
 * Generate new authorization token
 * @returns {any | number | PromiseLike<ArrayBuffer> | Buffer | string}
 */
Schema.methods.generateToken = function () {
  return Jwt.sign({id: this.id}, config.get("server:auth:jwt:jwtSecret"));
};

Schema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = Bcrypt.hashSync(this.password, Bcrypt.genSaltSync(8));
  }

  next();
});


Schema.set('toJSON', {
  transform: function(document: IUser, result: any) {
    if (result.password) {
      delete result.password;
    }

    return result;
  },
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