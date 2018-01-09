import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';

/**
 * That interface allow create user profiles
 */
interface IProfile extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * The string version of this documents _id
   */
  readonly id: string;
  /**
   * Email of current user profile
   */
  email: string;
  /**
   * First name of user profile
   */
  firstName: string;
  /**
   * Last name of user profile
   */
  lastName: string;
}

/**
 * Description of mongoose model schema
 * @type {"mongoose".Schema}
 */
const Schema = new Mongoose.Schema(
  {
    /**
     * Email of current user profile
     */
    email: {type: String, required: true},
    /**
     * First name of user profile
     */
    firstName: {type: Number, required: true},
    /**
     * Last name of user profile
     */
    lastName: {type: Date, required: true},
  },
  {
    /**
     * Allow automation add timestamps for ITimed interface
     */
    timestamps: true,
  },
);

/**
 * Mongoose model for IProfile interface
 * @type {Mongoose.Model<IProfile>}
 */
let Profile = Mongoose.model<IProfile>('Profile', Schema);

export {
  IProfile,
  Profile,
}
