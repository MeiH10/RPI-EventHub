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

//enums
const AccessLevel = {
    BANNED: 0,
    UNVERIFIED: 1,
    VERIFIED: 2,
    OFFICER: 3,
    ADMIN: 4
}//created Enums for user roles but not sure what BANNED,OFFICER, and ADMIN will be used for in the future. so will leave it here for now.

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

/**
 * This function is serving to reset the user password
 * @param req email, password, username
 * @param res
 * @returns {Promise<void>} calls signUpUser service function and returns the result
 * if there is an error, it will return a 500 status code with a message "
 * @modifies user collection
 * @throws: Non RPI email, username or email already exist."
 */
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
        const { email, password, verificationCode } = req.body;
        const result = await resetPassword(email, password, verificationCode);
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
 * @param req email and type of code.
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
        if (user.role === VERIFIED && type !== "reset") {
            return res.status(400).json({ message: "Bad Request, please contact administrator" });
        }

        // Generate verification details
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
        const verificationCode = `${type}:${code}:${expiresAt}`;

        // Save verification code
        user.role = UNVERIFIED;
        user.verificationCode = verificationCode;
        await user.save();

        // Send the code
        const result = await sendCode(email, code);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
}

/**
 * Update user roles by admin
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateUsers = async (req, res) => {
    try {
        const { users } = req.body;

        if (!Array.isArray(users)) {
            return res.status(400).json({ message: 'Invalid request format. Users must be an array.' });
        }

        // successful and failed updates
        const results = {
            success: [],
            failed: []
        };

        for (const userUpdate of users) {
            try {
                // find user by username
                const user = await User.findOne({ username: userUpdate.username });

                if (!user) {
                    results.failed.push({
                        username: userUpdate.username,
                        reason: 'User not found'
                    });
                    continue;
                }

                // update user role
                user.role = userUpdate.role;
                await user.save();

                logger.info(`User ${userUpdate.username} role updated to ${userUpdate.role} by admin ${req.user.username}---${new Date()}`);

                results.success.push({
                    username: userUpdate.username,
                    newRole: userUpdate.role
                });
            } catch (error) {
                results.failed.push({
                    username: userUpdate.username,
                    reason: error.message
                });
            }
        }

        res.status(200).json({
            message: 'User updates processed',
            results
        });
    } catch (error) {
        console.error('Error updating users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





module.exports = {
    signUp,
    verifyUserEmail,
    login,
    fetchAllUsernames,
    userExists,
    resetUserPassword,
    sendCodeEmail,
    updateUsers
};