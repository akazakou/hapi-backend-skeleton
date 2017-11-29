import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';
import {IBranch} from "../branch/branch";
import {IRetailer} from "../retailer/retailer";

/**
 * Description of Offer object
 */
interface IOffer extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * Title of offer
   */
  title: string;
  /**
   * Retailer information that own this branch
   */
  retailer: IRetailer | Mongoose.Types.ObjectId;
  /**
   * Date of starting campaign
   */
  campaignStartDate?: Date;
  /**
   * Date of end campaign
   */
  campaignEndDate?: Date;
  /**
   * List of available branches for this offer
   */
  branches: Array<IBranch>;
}

/**
 * Description of Offer schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * Title of offer
   */
  title: {type: String, required: true},
  /**
   * Retailer information that own this branch
   */
  retailer: {type: Mongoose.Types.ObjectId, required: true, ref: 'Retailer'},
  /**
   * Date of starting campaign
   */
  campaignStartDate: {type: Date, required: false},
  /**
   * Date of end campaign
   */
  campaignEndDate: {type: Date, required: false},
  /**
   * List of available branches for this offer
   */
  branches: {type: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Category'}], required: true},
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true,
});

/**
 * Database collection object for Offer entity
 * @type {"mongoose".Model<IOffer>}
 */
const Offer = Mongoose.model<IOffer>('Offer', Schema);

export {
  Offer,
  IOffer,
}