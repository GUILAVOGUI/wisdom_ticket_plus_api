const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');


const authMiddleware = async (req, res, next) => {

    console.log('auth checking..');
    try {
        const token = req.header('Authorization');
        console.log(`token: ${token}`);

        if (!token) {
            return res.status(401).json({ error: 'Middleware From AuthUsers Authorization token missing' });
        }

        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, { algorithms: ['HS256'] });
        const decodedTokenToken = token.replace('Bearer ', '')
        // Log the received token for verification
        // console.log('Received Token:', token);


        // Log the decoded token for verification
        // console.log('Decoded Token:', decodedToken);

        const user = await User.findById(decodedToken.userId);
        // console.log(user.role);

        // console.log(decodedTokenToken);
        // console.log(user.token);

 
        
        // Check if the signature matches
        // if (decodedToken.signature !== decodedToken.userId + process.env.JWT_SECRET) {
        if (decodedTokenToken !== user.token) {
            return res.status(401).json({ error: 'Invalid token: Signature mismatch' });
        }

   
        if (!user) {
            // console.log('Invalid token: User not found');
            return res.status(401).json({ error: 'Invalid token: User not found' });
        }

        // Attach the user object to the request for use in controllers
        req.user = user;
        req.phoneNumber = user.phoneNumber;
        req.userName = user.name;
        req.type = user.type;
        req.id = user.id;
        req.accessList = user.accessList;

        req.userId = user._id
        // console.log(`userID ${req.userId}`);

        console.log('authenticated');


      
        next();
    } catch (error) {
        console.log(error);
        // console.error('Invalid token:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
