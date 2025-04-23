const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { USER_ROLES } = require('../useful_script/userRolesCheck')

// Define the schema for a User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,             // remove surrounding whitespace
    minlength: 3,           // enforce a minimum length
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,        // store all emails in lowercase
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,           // enforce strong passwords
  },
  role: {
    type: Number,
    enum: Object.values(USER_ROLES),      // use shared role constants
    default: USER_ROLES.UNVERIFIED,       // new users must verify by default
  },
  verificationCode: {
    type: String,          // once they verify, you can clear this
    select: false,         // never return this field in queries by default
  },
  likedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
}, {
  timestamps: true,        // add createdAt & updatedAt
})

// ----------------------
// MIDDLEWARE & HELPERS
// ----------------------

// Hash password before saving if it was modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Compare a plaintext password to the stored hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Virtual property to check "verified or higher"
userSchema.virtual('isVerifiedOrAbove').get(function() {
  return this.role >= USER_ROLES.VERIFIED
})

// Remove sensitive fields when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password
    delete ret.__v
    delete ret.verificationCode
    return ret
  }
})
userSchema.set('toObject', userSchema.get('toJSON'))

userSchema.index({ email: 1 }, {
  unique: true,
  collation: { locale: 'en', strength: 2 },
})

const User = mongoose.model('User', userSchema)
module.exports = User
