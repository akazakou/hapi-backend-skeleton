import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';
import {IRetailer} from "../retailer/retailer";

/**
 * Description of GeoJSON objects
 */
interface IGeoJSON {
  /**
   * Type of GeoJSON object
   */
  type: "Point";
  /**
   * Coordinates of GeoJSON object
   */
  location: Array<number>;
}

/**
 * Description of branch object
 */
interface IBranch extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * Name of plan
   */
  name: string;
  /**
   * Retailer information that own this branch
   */
  retailer: IRetailer | Mongoose.Types.ObjectId;
  /**
   * Coordinated of object
   */
  location: IGeoJSON;
}

/**
 * Description of GeoJSON schema
 * @type {"mongoose".Schema}
 */
let GeoJSONSchema = new Mongoose.Schema({
  type: {type: String, required: true},
  coordinates: {type: [Number], required: true}
});

/**
 * Description of retailer schema for storing it into database
 */
let Schema = new Mongoose.Schema({
  /**
   * Name of plan
   */
  name: {type: String, required: true},
  /**
   * Retailer information that own this branch
   */
  retailer: {type: Mongoose.Types.ObjectId, required: true, ref: 'Retailer'},
  /**
   * Maximum number of branches available for retailer
   */
  location: {type: GeoJSONSchema, required: true},
}, {
  /**
   * Automatic set createdAt and updatedAt values
   */
  timestamps: true,
});

/**
 * Create 2dsphere index for GeoJSON data objects
 */
Schema.index({location: '2dsphere'});

/**
 * Database collection object for Branch entity
 * @type {"mongoose".Model<IBranch>}
 */
const Branch = Mongoose.model<IBranch>('Branch', Schema);

export {
  Branch,
  IBranch,
  IGeoJSON
}