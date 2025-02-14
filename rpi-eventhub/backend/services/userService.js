const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const {logger} = require('../services/eventsLogService');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const jwtSecret = process.env.JWT_SECRET;


/**
 * Sign up a new user
 * @param username
 * @param email
 * @param password
 * @returns
 * {
 * Promise<{emailVerified: ({default: boolean, type: Boolean | BooleanConstructor}|*),
 * message: string, email: ({unique: boolean, type: String | StringConstructor, required: boolean}|*),
 * token: (*)}>
 * }
 */
const signUpUser = async (username, email, password) => {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already in use.");
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw new Error("Username already taken.");
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create unverified user
    const user = new User({
        username,
        email,
        password,
        emailVerified: false,
        verificationCode,
    });
    await user.save();

    await sendEmail({
        to: email,
        subject: 'Action Required: Verify Your RPI EventHub Account',
        text: `Dear RPI EventHub User,

Thank you for registering with RPI EventHub! To activate your account, please use the following security code:

Verification Code: ${verificationCode}

This code will expire in 10 minutes.

How to complete your registration:
1. Return to the RPI EventHub registration page
2. Enter the 6-digit verification code above
3. Click "Verify"

If you didn't request this code, please ignore this message or create an issue at https://github.com/MeiH10/RPI-EventHub.

Security Reminder:
- Never share this code with others
- Our team will never ask for your password or verification codes

Best regards,
The RPI EventHub Team
Official Website: https://rpieventhub.com`
    });

    return {
        message: "Please check your email for the verification code.",
        email: user.email
    };
};


/**
 * This function verifies the email of the user
 * @param email
 * @param verificationCode
 * @returns {Promise<{message: string, token: (*)}>}
 */
const verifyEmail = async (email, verificationCode) => {

    // Find the user by email and verification code
    const user = await User.findOne({ email, verificationCode });

    // If user not found, throw an error
    if (!user) {
        throw new Error("Invalid email or verification code.");
    }


    // If the verification code matches, update the user's emailVerified status
    if (user.verificationCode === verificationCode) {
        user.emailVerified = true;
        user.verificationCode = '';
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, emailVerified: user.emailVerified, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log the event
        logger.info(`User ${user.username} email verified---${new Date()}`);

        return {
            message: "Email verified successfully.",
            token,
        };
    } else {
        throw new Error("Invalid verification code.");
    }
};

/**
 * This function logs in the user
 * @param email
 * @param password
 * @returns {Promise<{emailVerified: *, message: string, userId: *, token: (*)}>}
 */
const loginUser = async (email, password) => {

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email does not exist");
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
        throw new Error("Password is incorrect");
    }

    // use the jwt token to authenticate the user
    const token = jwt.sign(
        { userId: user._id, email: user.email, emailVerified: user.emailVerified, username: user.username },
        jwtSecret,
        { expiresIn: '24h' }
    );

    logger.info(`User ${user.username} logged in---${new Date()}`);

    return {
        token,
        userId: user._id,
        emailVerified: user.emailVerified,
        message: "Logged in successfully",
    };
};

/**
 * This function fetches all usernames
 */
const getAllUsernames = async () => {
    try {
        const users = await User.find({}, 'username');
        return users;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};

module.exports = { signUpUser , verifyEmail, loginUser, getAllUsernames};