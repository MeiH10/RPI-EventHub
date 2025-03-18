const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const {logger} = require('../services/eventsLogService');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const jwtSecret = process.env.JWT_SECRET;

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;


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

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new user
    const user = new User({
        username,
        email,
        password,
        role: UNVERIFIED,
        verificationCode,
    });
    await user.save();


    // Send verification email， and create a JWT token
    await sendEmail({
        to: email,
        subject: 'RPI EventHub Email Verification Code',
        text: `Dear User,\n\nThank you for registering with RPI EventHub. To complete your email verification, please use the following code:\n\nVerification Code: ${verificationCode}\n\nPlease enter this code in the app to verify your email address.\n\nBest regards,\nRPI EventHub Team`,
    });

    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    logger.info(`User ${user.username} signed up---${new Date()}`);

    return {
        message: "User created successfully. Please check your email to verify your account.",
        token,
        email: user.email,
        role: user.role,
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
        user.role = VERIFIED;
        user.verificationCode = '';
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, username: user.username },
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
 * @returns {Promise<{role: *, message: string, userId: *, token: (*)}>}
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
        { userId: user._id, email: user.email, role: user.role, username: user.username },
        jwtSecret,
        { expiresIn: '24h' }
    );

    logger.info(`User ${user.username} logged in---${new Date()}`);

    return {
        token,
        userId: user._id,
        role: user.role,
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