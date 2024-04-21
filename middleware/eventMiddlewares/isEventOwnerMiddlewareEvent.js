const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator'); // Import express-validator
const User = require('../../models/userModel');
require('dotenv').config();


const authMiddleware = async (req, res, next) => {
    console.log('checking auth middleware');
    try {
        // Use express-validator to validate the token
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation failed' });
        }
        console.log('pass 1');

        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        console.log('pass 2');


        // Verify the JWT token's signature using the JWT library's built-in verification
        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, { algorithms: ['HS256'] });

        // Define a validation middleware for decodedToken.userId
        const validateUserId = [
            check('decodedToken.userId').isAlphanumeric().withMessage('Invalid user ID in token'),
        ];

        // Apply the validation middleware to check decodedToken.userId
        validateUserId.forEach((validation) => {
            validation(req, res, () => { }); // Perform the validation
        });
        console.log('pass 3');


        // console.log(token);
        // console.log(decodedToken.userId);

        // Ensure that the userId in the token matches the user's identity in your database
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            // console.log('Invalid token: User not found');
            return res.status(401).json({ error: 'Authentication failed' });
        }

        console.log('pass 4');


        // console.log(user.role);
        // console.log(user.name);

        if (user.type !== 'Organizer' && user.type !== 'Admin' && user.type !== 'Super_Admin') {
            return res.status(403).json({ error: 'Access denied,Not a Shop Owner' });
        }

        // Set the authenticated user in the request object for use in subsequent middleware or routes
        // req.user = user;
        console.log(`auth valid`);

        req.user = user;
        req.tel = user.tel;
        req.userId = user.id;
        req.ownerProfileImage = user.userProfileImage


        next();
    } catch (error) {
        console.error('Invalid token:', error.message);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
