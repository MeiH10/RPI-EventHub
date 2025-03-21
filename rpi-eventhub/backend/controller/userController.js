const {
    signUpUser,
    verifyEmail,
    loginUser,
    getAllUsernames,
    verifyEmailExists,
    resetPassword,
    sendCode,
} = require('../services/userService');

const User = require('../models/User');

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await signUpUser(username, email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error creating user. It's possible that username or email address already exist.", error: error.message });
    }
};


const verifyUserEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const result = await verifyEmail(email, verificationCode);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error during email verification:", error.message);
        res.status(500).json({ 
            message: "Invalid verification code or email address.", 
            error: error.message 
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
};


const fetchAllUsernames = async (req, res) => {
    try {
        const users = await getAllUsernames();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

/**
 * This function is serving to reset the user password
 * @param req email, password, verificationCode
 * @param res
 * @returns {Promise<void>}
 */
const resetUserPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await resetPassword(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
}

const userExists = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await verifyEmailExists(email)
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
}

/**
 * This function is serving to send a new verification code to the user
 * @param req
 * @param res
 * @requires email the user's email is not verified.
 * @returns {Promise<*>} if the user is not found, it will return a 400 status code with a message "User not found."
 * if the user has already verified their email and not requesting reset password, it will return a 400 status code with a message "Bad Request, please contact administrator"
 * if the user is found, it will return a 200 status code with the result of the sendCode function.
 */
const sendCodeEmail = async (req, res) => {
    try {
        const { email, type } = req.body;

        // Find user first to fail fast
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Check if the user has already verified their email and not requesting reset
        if (user.emailVerified && type !== "reset") {
            return res.status(400).json({ message: "Bad Request, please contact administrator" });
        }

        // Generate verification details
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        const verificationCode = `${type}:${code}:${expiresAt}`;

        // Save verification code
        user.emailVerified = false;
        user.verificationCode = verificationCode;
        await user.save();

        // Send the code
        const result = await sendCode(email, code);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
}

module.exports = {
    signUp,
    verifyUserEmail,
    login,
    fetchAllUsernames,
    userExists,
    resetUserPassword,
    sendCodeEmail
};