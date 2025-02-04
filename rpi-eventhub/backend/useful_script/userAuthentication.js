const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.' , error: error.message });
    }
};

const authenticateAndVerify = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.emailVerified) {
            return res.status(403).json({ message: 'Please verify your email to perform this action.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.' , error: error.message });
    }
};

module.exports = { authenticate, authenticateAndVerify };