import { Schema as DatabaseSchema } from 'mongoose'

/**
 * Description of mongoose model schema
 * @type {DatabaseSchema}
 */
const Schema = new DatabaseSchema(
  {
    /**
     * Email of current user profile
     */
    user: { type: DatabaseSchema.Types.ObjectId, required: true, unique: true, ref: 'User' },
    /**
     * Email of current user profile
     */
    email: { type: String, required: true },
    /**
     * First name of user profile
     */
    firstName: { type: String, required: true },
    /**
     * Last name of user profile
     */
    lastName: { type: String, required: true }
  },
  {
    /**
     * Allow automation add timestamps for ITimed interface
     */
    timestamps: true
  }
)

export default Schema
