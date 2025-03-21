const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: Number, // Role as an integer
    enum: [0, 1, 2, 3, 4], // Banned, Unverified, Verified, ClubOfficer, Admin
    default: 1 // Default to "unverified" for new users
  },
  verificationCode: { type: String, required: false }, // Optional: For storing the email verification code
  likedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
  // Consider adding an expiry date for the verification code if implementing a timeout feature
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
