import * as Mongoose from 'mongoose';
import {ITimed} from '../misc/timed';
import * as Config from "../../services/config";

const config = Config.init();

/**
 * That interface allow create files records
 */
interface IFile extends Mongoose.Document, ITimed, Mongoose.MongooseDocumentOptionals {
  /**
   * Type of current file
   */
  type: 'IFile';
  /**
   * Size in bytes
   */
  size: number;
  /**
   * Date when file was uploaded
   */
  date: Date;
  /**
   * Mime type of file
   * @see https://developer.mozilla.org/en/docs/Web/HTTP/Basics_of_HTTP/MIME_Types
   */
  mime: string;
  /**
   * Path in files storage to accessing that file
   */
  path: string;
  /**
   * Virtual generated url for accessing to it in storage over HTTPS
   */
  readonly url: string;
}

/**
 * Description of mongoose model schema
 * @type {"mongoose".Schema}
 */
const Schema = new Mongoose.Schema(
  {
    /**
     * Used interface for this file object
     */
    type: {type: Mongoose.Schema.Types.String, required: true},
    /**
     * Size in bytes
     */
    size: {type: Mongoose.Schema.Types.Number, required: true},
    /**
     * Date when file was uploaded
     */
    date: {type: Mongoose.Schema.Types.Date, required: true},
    /**
     * Mime type of file
     * @see https://developer.mozilla.org/en/docs/Web/HTTP/Basics_of_HTTP/MIME_Types
     */
    mime: {type: Mongoose.Schema.Types.String, required: true},
    /**
     * Path in files storage to accessing that file
     */
    path: {type: Mongoose.Schema.Types.String, required: true},
  },
  {
    /**
     * Allow automation add timestamps for ITimed interface
     */
    timestamps: true,
    /**
     * Allow using virtuals in toObject() converting
     */
    toObject: {
      virtuals: true
    },
    /**
     * Allow using virtuals in toJSON() converting
     */
    toJSON: {
      virtuals: true
    }
  },
);

/**
 * Generate URL for accessing to encrypted file
 * @param fileId
 * @returns {string}
 */
function generateFileUrl(fileId: string): string {
  return `${config.get('uploads:baseUrl')}/uploads/${fileId}`;
}

/**
 * Define virtual URL property to access file
 */
Schema.virtual('url').get(function () {
  return generateFileUrl(this._id.toString());
});

/**
 * Mongoose model for INotification interface
 * @type {"mongoose".Model<IFile>}
 */
let File = Mongoose.model<IFile>('File', Schema);

export {
  IFile,
  File,
  generateFileUrl,
}