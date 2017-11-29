import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';
import {IUser} from "../user/user";
import {IFile} from "../file/file";
import {IPlan} from "../plan/plan";

/**
 * Description of retailer object
 */
interface IRetailer extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * User that own this information
   */
  user: IUser | Mongoose.Types.ObjectId;
  /**
   * Brand name
   */
  brandName: string;
  /**
   * Image with logotype of retailer
   */
  logo: IFile | Mongoose.Types.ObjectId;
  /**
   * Commercial record number
   */
  commercialRecordNumber: string;
  /**
   * Company name
   */
  companyName: string;
  /**
   * Representative Email
   */
  representativeEmail: string;
  /**
   * Representative Mobile Number
   */
  representativeMobileNumber: string;
  /**
   * Plan that assigned to that retailer
   */
  plan: IPlan | Mongoose.Types.ObjectId;
}

/**
 * Description of retailer schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * User that own this information
   */
  user: {type: Mongoose.Types.ObjectId, required: true, ref: 'User'},
  /**
   * Brand name
   */
  brandName: {type: String, required: true},
  /**
   * Brand name
   */
  logo: {type: Mongoose.Types.ObjectId, required: true, ref: 'File'},
  /**
   * Brand name
   */
  commercialRecordNumber: {type: String, required: true},
  /**
   * Brand name
   */
  companyName: {type: String, required: true},
  /**
   * Brand name
   */
  representativeEmail: {type: String, required: true},
  /**
   * Brand name
   */
  representativeMobileNumber: {type: String, required: true},
  /**
   * Brand name
   */
  plan: {type: Mongoose.Types.ObjectId, required: true, ref: 'Plan'},
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true,
});

/**
 * Database collection object for Retailer entity
 * @type {"mongoose".Model<IRetailer>}
 */
const Retailer = Mongoose.model<IRetailer>('Retailer', Schema);

export {
  Retailer,
  IRetailer,
}