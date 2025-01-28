const { signUpUser, verifyEmail, loginUser, getAllUsernames } = require('../services/userService');

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
        res.status(500).json({ message: "An error occurred during email verification.", error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Login error", error: error.message });
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

module.exports = { signUp, verifyUserEmail, login, fetchAllUsernames };