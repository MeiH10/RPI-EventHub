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
 * @returns {Promise<{message: string, email: string}>}
 */
const signUpUser = async (username, email, password) => {
    // Check if email is end with @rpi.edu
    if (!email.endsWith('@rpi.edu')) {
        throw new Error("Email must end with @rpi.edu");
    }

    if (typeof email != "string") {
        throw new Error("Invalid email/password");
    }
    if (typeof password != "string") {
        throw new Error("Invalid email/password");
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // IMPORTANT Schema here
    const verificationCode = `signup:${code}:${expiresAt}`;

    // Check if email already exists
    // This happened when the user is trying to sign up again
    // or the user is trying to resend the verification code
    // or the user has refresh the page
    const existingUser = await User.findOne({ email });
    if (existingUser) {

        // Check if the user is unverified
        if (existingUser.role === UNVERIFIED) {
            // Apply newly generated verification code
            existingUser.verificationCode = verificationCode;
            await existingUser.save();
            // resend the verification code
            await sendCode( email, code )

            // This message will show up in the frontend by toast.
            return {
                message: "Your code has resend, please check your email for the verification code.",
            };
        }
        // if the user is already verified, means the user is trying to sign up again
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

    // The code here is the 6-digit code
    await sendCode(email, code)

    return {
        message: "Please check your email for the verification code.",
        email: user.email
    };
};


/**
 * This function verifies the email of the user
 * @param email
 * @param verificationCode the verification code here has only number phrase
 * @returns {Promise<{message: string, token: (*)}>}
 */
const verifyEmail = async (email, verificationCode) => {

    if (typeof email != "string") {
        throw new Error("Invalid email/password");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, throw an error
    if (!user) {
        throw new Error("Invalid email or verification code.");
    }

    // parse code from db
    const [codeType, storedCode, expiresAt] = user.verificationCode.split(':');

    if (codeType !== "signup"){
        throw new Error("The verification code type isn't match")
    }


    // Check if its expired, 15 minutes
    const isExpired = Date.now() > parseInt(expiresAt, 15);
    if (isExpired) {
        // set the user to unverified
        user.role = UNVERIFIED;
        user.verificationCode = '';
        await user.save();

        throw new Error("Verification Code Expired, Please resend the code");
    }

    // compare verification code
    if (verificationCode !== storedCode) {
        throw new Error("Verification Code Error");
    }

    // set the user to verified
    user.role = VERIFIED;
    user.verificationCode = ''; // clean verification code
    await user.save();

    // local token for frontend
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
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
        throw new Error("Invalid email/password");
    }
    if (typeof password != "string") {
        throw new Error("Invalid email/password");
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email does not exist");
    }

    // Define validation checks
    const validations = [
        { condition: async () => !(await bcrypt.compare(password.trim(), user.password)), message: "Password is incorrect" },
        { condition: () => user.role === BANNED, message: "User is banned" },
        { condition: () => user.role === UNVERIFIED, message: "Please verify your email first" }
    ];

    // Run validations
    for (const validation of validations) {
        if (await validation.condition()) {
            throw new Error(validation.message);
        }
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

This code will expire in 15 minutes.

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

    if (typeof email != "string") {
        throw new Error("Invalid email/password");
    }
    if (typeof newPassword != "string") {
        throw new Error("Invalid email/password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email does not exist" + email);
    }
    // Check verification code
    const [codeType, storedCode, expiresAt] = user.verificationCode.split(':');
    if (codeType !== "reset"){
        throw new Error("The verification code type isn't match, contact administrator")
    }
    // Check if its expired
    const isExpired = Date.now() > parseInt(expiresAt, 15);
    if (isExpired) {
        user.role = UNVERIFIED;
        user.verificationCode = '';
        await user.save();
        throw new Error("Verification Code Expired, Please Send Again");
    }
    // compare verification code
    if (verificationCode !== storedCode) {
        throw new Error("Verification Code Error" + verificationCode);
    }

    // Update the user's password
    // user.password = hashedPassword;
    user.password = newPassword;
    user.role = VERIFIED; // set the user to verified
    user.verificationCode = ''; // clean verification code
    await user.save();
    logger.info(`User ${user.username} password reset --- ${new Date()}`);
    return {
        message: "Password reset successfully",
        userId: user._id,
        role: user.role,
    };
}

/**
 * This function will verify if the email exists
 * @param email
 * @requires email the user's email is end with @rpi.edu
 * @returns {Promise<{message: string, role: *}>}
 */
const verifyEmailExists = async (email) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email does not exist" + email);
    }
    // Check if the email is verified
    if (user.role === UNVERIFIED) {
        throw new Error("Email is not verified");
    }
    // Check if the email is in the correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Flagged as Denial of Service if the input email is too long.
    // Added as a precautionary measure.
    // See: https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
    if(email.length > 1000) {
        throw new Error("Email is not in the correct format");
    }

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
        role: user.role,
    };
}


module.exports = { signUpUser , verifyEmail, loginUser, getAllUsernames, resetPassword, verifyEmailExists, sendCode};