const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const {logger} = require('../services/eventsLogService');
const bcrypt = require('bcrypt');
const path = require('path');
const {Error} = require("mongoose");
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
    // Check if email is end with @rpi.edu
    if (!email.endsWith('@rpi.edu')) {
        throw new Error("Email must end with @rpi.edu");
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    const verificationCode = `email:${code}:${expiresAt}`;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (!existingUser.emailVerified) {
            existingUser.verificationCode = verificationCode;
            await existingUser.save();
            await sendCode( email, code )
            return {
                message: "Your code has resend, please check your email for the verification code.",
            };
        }
        throw new Error("Email already in use.");
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw new Error("Username already taken.");
    }

    // Create unverified user
    const user = new User({
        username,
        email,
        password,
        role: UNVERIFIED,
        verificationCode,
    });
    await user.save();

    await sendCode(email, verificationCode)

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

    // parse code in db
    const [codeType, storedCode, expiresAt] = user.verificationCode.split(':');

    if (codeType !== "email"){
        throw new Error("The verification code type isn't match")
    }


    // Check if its expired
    const isExpired = Date.now() > parseInt(expiresAt, 15);
    if (isExpired) {
        user.emailVerified = false;
        user.verificationCode = '';
        await user.save();
        throw new Error("Verification Code Expired, Please Send Again");
    }

    // compare verification code
    if (verificationCode !== storedCode) {
        throw new Error("Verification Code Error");
    }

    user.emailVerified = true;
    user.verificationCode = ''; // clean verification code
    await user.save();

    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            emailVerified: true,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    logger.info(`Email Verification Successfully: ${user.username} - ${new Date()}`);

    return { message: "Email Verification Successfully", token };
};

/**
 * This function logs in the user
 * @param email
 * @param password
 * @returns {Promise<{role: *, message: string, userId: *, token: (*)}>}
 */
const loginUser = async (email, password) => {

    if (typeof email != "string") {
        throw new Error("Email does not exist");
    }
    if (typeof password != "string") {
        throw new Error("Password is incorrect");
    }

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

/**
 * This function is serving to send a new verification code to the user
 * @param email the email of the user
 * @param code the verification code
 */
const sendCode = async ( email, code ) => {
    await sendEmail({
        to: email,
        subject: 'Action Required: Verify Your RPI EventHub Account',
        text: `Dear RPI EventHub User,

Thank you for registering with RPI EventHub! To activate your account, please use the following security code:

Verification Code: ${code}

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
        message: "Verification code sent successfully",
        email: email
    }
}

/**
 * This function will be used to delete the user by just email
 * @param email
 * @returns {Promise<{message: string, deletedUser: {username: string, email: string}}>}
 */
const deleteUser = async (email) => {
    try {
        // Find and delete the user
        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            throw new Error("User not found");
        }

        logger.info(`User ${deletedUser.username} deleted --- ${new Date()}`);

        return {
            message: `User ${deletedUser.username} was successfully deleted`,
            deletedUser: {
                username: deletedUser.username,
                email: deletedUser.email
            }
        };
    } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }
}

/**
 * This function will be used to reset the password
 * @param email
 * @param newPassword
 * @param verificationCode
 */
const resetPassword = async (email, newPassword, verificationCode) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email does not exist" + email);
    }
    // Check verification code
    const [codeType, storedCode, expiresAt] = user.verificationCode.split(':');
    if (codeType !== "reset"){
        throw new Error("The verification code type isn't match")
    }
    // Check if its expired
    const isExpired = Date.now() > parseInt(expiresAt, 15);
    if (isExpired) {
        user.emailVerified = false;
        user.verificationCode = '';
        await user.save();
        throw new Error("Verification Code Expired, Please Send Again");
    }
    // compare verification code
    if (verificationCode !== storedCode) {
        throw new Error("Verification Code Error");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    logger.info(`User ${user.username} password reset --- ${new Date()}`);
    return {
        message: "Password reset successfully",
        userId: user._id,
        emailVerified: user.emailVerified,
    };
}

/**
 * This function will verify if the email exists
 * @param email
 * @requires email the user's email is end with @rpi.edu
 * @returns {Promise<{message: string, emailVerified: boolean}>}
 */
const verifyEmailExists = async (email) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email does not exist" + email);
    }
    // Check if the email is verified
    if (!user.emailVerified) {
        throw new Error("Email is not verified");
    }
    // Check if the email is in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Email is not in the correct format");
    }
    // Double check if the email is in the correct domain
    const domain = email.split('@')[1];
    if (domain !== 'rpi.edu') {
        throw new Error("Email is not in the correct domain");
    }

    return {
        message: "Email is valid",
        emailVerified: user.emailVerified,
    };
}


module.exports = { signUpUser , verifyEmail, loginUser, getAllUsernames, resetPassword, verifyEmailExists, sendCode};