const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('./emailService');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    const resetURL = `http://${req.headers.host}/reset-password/${token}`;
    const message = `You are receiving this because you (or someone else) have requested to reset the password of your account.\n\n
                      Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n
                      ${resetURL}\n\n
                      If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message,
    });

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
