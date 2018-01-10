import { Schema as DatabaseSchema, Types } from 'mongoose'
import * as Bcrypt from 'bcrypt'
import Interface from './interface'

/**
 * Description of mongoose model schema
 * @type {"mongoose".Schema}
 */
const Schema = new DatabaseSchema(
  {
    /**
     * Email of current user profile
     */
    user: { type: Types.ObjectId, required: true, ref: 'User' },
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
    /**
     * Flag that indicates the user is active or not
     */
    isActive: { type: Boolean, required: true, unique: false, default: true },
    /**
     * Login will be used for identify user
     */
    login: { type: String, required: true, unique: true },
    /**
     * Password hash for validation of user authorisation
     */
    password: { type: String, required: true }
  },
  {
    /**
     * Allow automation add timestamps for ITimed interface
     */
    timestamps: true
  }
)

/**
 * Validate password that was requested on auth method
 * @param {string} requestPassword
 * @returns {any}
 */
Schema.methods.validatePassword = function (requestPassword: string) {
  return Bcrypt.compareSync(requestPassword, this.password)
}

/**
 * Hashing password on update that field ot creating new user record
 */
Schema.pre('save', function (this: Interface, next) {
  if (this.isModified('password')) {
    this.password = Bcrypt.hashSync(this.password, Bcrypt.genSaltSync(8))
  }

  next()
})

/**
 * Remove password field from JSON objects
 */
Schema.set('toJSON', {
  transform: function (document: Interface, result: any) {
    if (result.password) {
      delete result.password
    }

    return result
  }
})

export default Schema
