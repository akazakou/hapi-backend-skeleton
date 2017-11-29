import * as Mongoose from 'mongoose';
import * as Hapi from 'hapi';
import * as Bcrypt from 'bcrypt';
import {ITimed} from '../misc/timed';
import * as Jwt from 'jsonwebtoken';
import * as Config from "../../services/config";
import * as Boom from "boom";
import {IUser} from "../../features/user/validator";

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
type TypeRoles = TypeRoleAdmin | TypeRoleRetailer | TypeRoleUser | TypeRoleUnknown;

/**
 * List available user roles
 * @type {{ADMIN: TypeRoleAdmin; RETAILER: TypeRoleRetailer; USER: TypeRoleUser; UNKNOWN: TypeRoleUnknown}}
 */
const Role: { ADMIN: TypeRoleAdmin; RETAILER: TypeRoleRetailer; USER: TypeRoleUser; UNKNOWN: TypeRoleUnknown } = {
  ADMIN: "administrator" as TypeRoleAdmin,
  RETAILER: "retailer" as TypeRoleRetailer,
  USER: "user" as TypeRoleUser,
  UNKNOWN: "unknown" as TypeRoleUnknown,
};

/**
 * Description of user object
 */
interface IUser extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * Flag that indicates the user is active or not
   * Disabled user can't login
   */
  isActive: boolean;
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
   * Assigned user access roles
   */
  roles: TypeRoles[];

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
 * Interface for user schema
 */
interface IUserSchema extends Mongoose.Model<IUser> {
  /**
   * Parse Hapi request and extract user object from it
   * @param {Request} request
   * @returns {Promise<IUser>}
   */
  getUserFromRequest(request: Hapi.Request): Promise<IUser>;
}

/**
 * Description of user schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * Flag that indicates the user is active or not
   */
  isActive: {type: Boolean, required: true, unique: false, default: true},
  /**
   * Login will be used for identify user
   */
  login: {type: String, required: true, unique: true},
  /**
   * Password hash for validation of user authorisation
   */
  password: {type: String, required: true},
  /**
   * Assigned user access roles
   */
  roles: {
    type: [String],
    required: true,
    default: [Role.UNKNOWN],
    validate: [(val: string[]) => {
      let allowed = [Role.ADMIN, Role.RETAILER, Role.USER, Role.UNKNOWN];
      for (let check of val) {
        if (allowed.indexOf(check as TypeRoles) === -1) {
          return false;
        }
      }

      return true;
    }, 'Array of user roles contains non existed role']
  },
  /**
   * JWT Auth token value
   */
  token: {type: String, required: false},
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

/**
 * Parse Hapi request and extract user object from it
 * @param {Request} request
 * @returns {Promise<IUser>}
 */
Schema.statics.getUserFromRequest = async function (request: Hapi.Request): Promise<IUser> {
  if (config.get("server:auth:jwt:active")) {
    if (!request.auth || !request.auth.credentials || !request.auth.credentials.id) {
      throw Boom.unauthorized(`User not authorised`);
    }

    return await this.findById(request.auth.credentials.id);
  }

  return await this.findOne();
};

/**
 * Hashing password on update that field ot creating new user record
 */
Schema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = Bcrypt.hashSync(this.password, Bcrypt.genSaltSync(8));
  }

  next();
});

/**
 * Remove password field from JSON objects
 */
Schema.set('toJSON', {
  transform: function (document: IUser, result: any) {
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
const User: IUserSchema = Mongoose.model<IUser, IUserSchema>('User', Schema);

export {
  User,
  IUser,
  Role,
  TypeRoles,
  TypeRoleAdmin,
  TypeRoleRetailer,
  TypeRoleUser,
  TypeRoleUnknown,
}