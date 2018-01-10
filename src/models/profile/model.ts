import * as Mongoose from 'mongoose'
import Interface from './interface'
import Schema from './schema'

/**
 * Mongoose model for IProfile interface
 * @type {Mongoose.Model<IProfile>}
 */
const Model = Mongoose.model<Interface>('Profile', Schema)

export default Model
