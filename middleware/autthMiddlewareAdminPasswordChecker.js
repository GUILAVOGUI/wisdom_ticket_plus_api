const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult, check } = require('express-validator');
// const User = require('../models/user');
const User = require('../models/userModel');


require('dotenv').config();

const authMiddlewareAdminPasswordChecker = async (req, res, next) => {
    console.log('authMiddlewareAdminPasswordChecker');
    try {
        console.log('Checking Admin Password');

        const token = req.header('Authorization');
        const { secretCode } = req.body;

        // console.log(`token: ${token}`);

        // console.log(`secretCode: ${secretCode}`);


        if (!secretCode) {
            console.log('Authentication failed, missing Secret Code');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        // console.log(`decoded token: ${JSON.stringify(decodedToken)}`);

        // Ensure that the userId in the token matches the user's identity in your database
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            console.log('Invalid token: User not found');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        // Compare the provided secretCode with the user's secretCode in the database
        const isPasswordValid = await bcrypt.compare(secretCode, user.secretCode);
        if (!isPasswordValid) {
            console.log('Invalid credentials: Incorrect secret code');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        // Set the authenticated user in the request object for use in subsequent middleware or routes
        req.user = user;
        console.log('Authentication successful');
        next();
    } catch (error) {
        console.log(error);
        console.error('Invalid token:', error.message);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddlewareAdminPasswordChecker;
