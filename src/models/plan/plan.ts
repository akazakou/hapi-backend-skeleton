import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';

/**
 * Description of plan object
 */
interface IPlan extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * Name of plan
   */
  name: string;
  /**
   * Maximum number of branches available for retailer
   */
  maximumNumberOfBranches: number;
  /**
   * Maximum number of offers available for retailer
   */
  maximumNumberOfOffers: number;
}

/**
 * Description of retailer schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * Name of plan
   */
  name: {type: String, required: true},
  /**
   * Maximum number of branches available for retailer
   */
  maximumNumberOfBranches: {type: Number, required: true},
  /**
   * Maximum number of offers available for retailer
   */
  maximumNumberOfOffers: {type: Number, required: true},
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true,
});

/**
 * Database collection object for Retailer entity
 * @type {"mongoose".Model<IPlan>}
 */
const Plan = Mongoose.model<IPlan>('Plan', Schema);

export {
  Plan,
  IPlan,
}