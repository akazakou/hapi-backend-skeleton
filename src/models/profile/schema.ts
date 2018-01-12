import { Schema as DatabaseSchema, Types } from 'mongoose'

/**
 * Description of mongoose model schema
 * @type {"mongoose".Schema}
 */
const Schema = new DatabaseSchema(
  {
    /**
     * Email of current user profile
     */
    user: { type: DatabaseSchema.Types.ObjectId, required: true, ref: 'User' },
    /**
     * Email of current user profile
     */
    email: { type: String, required: true },
    /**
     * First name of user profile
     */
    firstName: { type: Number, required: true },
    /**
     * Last name of user profile
     */
    lastName: { type: Date, required: true },
  },
  {
    /**
     * Allow automation add timestamps for ITimed interface
     */
    timestamps: true
  }
)

export default Schema
