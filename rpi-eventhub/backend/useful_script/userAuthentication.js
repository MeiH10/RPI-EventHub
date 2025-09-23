const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

const authenticate = async (req, res, next) => {
    try {
        if (!req.header('Authorization') || !req.header('Authorization').startsWith('Bearer ')) {
            return res.status(401).send({ message: 'No authentication token provided' });
        }

        const token = req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.', error: error.message });
    }
};

const authenticateAndVerify = async (req, res, next) => {
    try {
        if (!req.header('Authorization') || !req.header('Authorization').startsWith('Bearer ')) {
            return res.status(401).send({ message: 'No authentication token provided' });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.role === UNVERIFIED) {
            return res.status(403).json({ message: 'Please verify your email to perform this action.' });
        } else if (user.role === BANNED) {
            return res.status(403).json({ message: 'Your account has been banned. If you believe this is a mistake, please reach out to site admin.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.', error: error.message });
    }
};

const authorizeOfficer = (req, res, next) => {
    if (!req.user || req.user.role !== OFFICER) {
        return res.status(403).json({ message: 'Access denied. Officer privileges required.' });
    }

    next();
};

const authorizeAdmin = (req, res, next) => {
    const ADMIN = 4;

    if (!req.user || req.user.role !== ADMIN) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
};

module.exports = { authenticate, authenticateAndVerify, authorizeOfficer, authorizeAdmin };