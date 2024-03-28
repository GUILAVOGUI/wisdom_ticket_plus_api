const User = require('../models/old/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


require('dotenv').config();

async function adminAddReduceWallet(req, res, next) {
 

    // const userId = req.params.id; // Get userId from the request parameters
    // console.log(`userId: ${userId}`);
   
    const pinCodeFromBody = req.body.pinCode; // Get the wallet change value from the request body
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Authorization token From PIN CHECK missing' });
    }


    if (!pinCodeFromBody) {
        return res.status(401).json({ error: 'Authorization PIN missing' });
    }


    try {
        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decodedToken; // Attach the user information to the request object
        // console.log(decodedToken.userId);

        // Find the user from the database using the userId
        const user = await User.findById(decodedToken.userId);
        // const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided secretCode with the hashed secretCode in the database
        // console.log(`user: ${user}`);
        // console.log(`user Pincode: ${user.pinCode}`);
        // console.log(`req pincode: ${pinCodeFromBody}`);
        const isPinValid = await bcrypt.compare(pinCodeFromBody, user.pinCode);
        if (!isPinValid) {
            // console.log('Invalid credentials: Incorrect PIN code');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // console.log(`Pincode valid`);
       

        next();
    } catch (error) {
        // console.error('Error updating transaction history:', error);
        return res.status(500).json({ error: 'Error updating transaction history' });
    }
}

module.exports = adminAddReduceWallet;
