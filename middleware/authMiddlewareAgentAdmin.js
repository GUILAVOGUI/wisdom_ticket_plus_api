const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator'); // Import express-validator
const User = require('../models/old/user');
require('dotenv').config();

const authMiddlewareAgentAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ error: 'Middleware Authorization token missing' });
        }

        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, { algorithms: ['HS256'] });

        // Define a validation middleware for decodedToken.userId
        const validateUserId = [
            check('decodedToken.userId').isAlphanumeric().withMessage('Invalid user ID in token'),
        ];

        // Apply the validation middleware to check decodedToken.userId
        validateUserId.forEach((validation) => {
            validation(req, res, () => { }); // Perform the validation
        });

        // Check if the signature matches
        if (decodedToken.signature !== decodedToken.userId + process.env.JWT_SECRET) {
            return res.status(401).json({ error: 'Invalid token: Signature mismatch' });
        }

        const user = await User.findById(decodedToken.userId);

        if (!user) {
            // console.log('Invalid User not found');
            return res.status(401).json({ error: 'Invalid token: User not found' });
        }

        if (user.role !== 'admin' && user.role !== 'agentAdmin') {
            return res.status(403).json({ error: 'Unauthorized to access this resource' });
        }

        // console.log(`auth  valid`);
        next();
    } catch (error) {
        // console.error('Invalid token:', error.message);
        return res.status(401).json({ error: 'Invalid auth' });
    }
};

module.exports = authMiddlewareAgentAdmin;
