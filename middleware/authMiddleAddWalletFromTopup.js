const User = require('../models/old/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function addWallet(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decodedToken; // Attach the user information to the request object

        // Convert req.body.depotAmount to a number
        const orderTotalAmount = parseFloat(req.body.depotAmount);
        // console.log(orderTotalAmount);

        // Check if orderTotalAmount is a valid number
        if (isNaN(orderTotalAmount)) {
            return res.status(400).json({ error: 'Invalid depot amount' });
        }

        // Find the user from the database using the userId
        // const user = await User.findById(decodedToken.userId);
        const user = await User.findById(req.body.refUser);
        // console.log(req.body.refUser);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const previousAmount = user.userWallet;
        const amountChanged = orderTotalAmount; // Use orderTotalAmount as the amount to reduce
        const newAmount = previousAmount + amountChanged;
        const userId = user.id
        const userName = user.name
        const userTel = user.tel
        // console.log(userId);

        const transaction = {
            userId,
            transactionType: 'added',
            previousAmount,
            amountChanged,
            newAmount,
            userName,
            userTel,
            otherDetail: 'TopUp'
        };

        // console.log(transaction);

        // Update user's transaction history
        await User.findByIdAndUpdate(
            userId,
            {
                $push: { transactionsHistoric: transaction },
                $set: { userWallet: newAmount }
            }
        );

        // console.log('transaction history saved');

        // // Call the next function to proceed to the next middleware or route handler
        // next();
    } catch (error) {
        // console.error('Error updating transaction history:', error);
        return res.status(500).json({ error: 'Error updating transaction history' });
    }
}

module.exports = addWallet;
