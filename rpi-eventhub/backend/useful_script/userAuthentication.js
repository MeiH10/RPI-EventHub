const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;


/**
 * This middleware function authenticates connections, atatches
 * a "user" property to the request that contains the User that the
 * request comes from.
 * 
 * Denies access with 403 if user isn't logged in or has admin access.
 * @param req The incoming request, usually unedited.
 * @param res The outgoing response object.
 * @param {NextFunction} next The next function, probably a function that checks a user's permissions
 * or an end function.
 * @returns A 401 response if there is no authentication token, or if an error has been thrown (no user found, 
 * error while parsing token, or with retrieving from the the MongoDB database). It also returns 
 */
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

/**
 * This middleware function authenticates connections, atatches
 * a "user" property to the request that contains the User that the
 * request comes from. Additionally, it verifies the user's status, and
 * denies access to unverified and banned users.
 * 
 * Denies access with 403 if user isn't logged in or has admin access.
 * @param req The incoming request, usually unedited.
 * @param res The outgoing response object.
 * @param {NextFunction} next The next function, probably a function that checks a user's permissions
 * or an end function.
 * @returns A 401 response if there is no authentication token, or if an error has been thrown (no user found, 
 * error while parsing token, or with retrieving from the the MongoDB database).
 */
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

/**
 * This middleware function checks admin access, can be used in routes to assert
 * admin access.
 * 
 * Denies access with 403 if user isn't logged in or has admin access.
 * @param req The incoming request, should have been passed through "authenticate" method.
 * @param res The outgoing response object.
 * @param {NextFunction} next The next function, probably a function that actually does something
 * @returns A 403 response if the user doesn't have admin access, none if not.
 */
const authorizeAdmin = (req, res, next) => {
    const ADMIN = 4;

    if (!req.user || req.user.role !== ADMIN) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
};

module.exports = { authenticate, authenticateAndVerify, authorizeAdmin };