const Budget = require('../models/old/budget');


const jwt = require('jsonwebtoken');
const Decimal = require('decimal.js');

require('dotenv').config();

async function budgetUpdater(req, res, next) {

    try {

        const {  item, budgetId, transactionType } = req.body;
        const user = req.user;

 
        // Calculate the total
        const { quantity, price, unit, itemName } = item;
        const total = quantity * price;


        
 
        // Find the user from the database using the userId
        const budget = await Budget.findById(budgetId);
        // console.log(user);
        if (!budget) {
            return res.status(404).json({ error: 'User not found' });
        }

        const previousAmount = budget.budgetAmount;        
        const amountChanged = total; // Use orderTotalAmount as the amount to reduce

        const transaction = {
            userId: user.id,
            transactionType,
            previousAmount,
            amountChanged: total,
            newAmount: transactionType === 'added' ? previousAmount + total : (transactionType === 'reduced' ? previousAmount - total : previousAmount),
            userName: user.name,
            userTel: user.tel,
            item: item
        };


        if (transactionType && transactionType === "added") {
           const newBudget =  budget.budgetAmount + amountChanged

            await Budget.findByIdAndUpdate(
                budgetId,
                {
                    $set: { budgetAmount: newBudget },
                    $set: { transactionsHistoric: transaction },

                },

            );
        } else if (transactionType  && transactionType === "reduced") {
            const newBudget = budget.budgetAmount - amountChanged

            await Budget.findByIdAndUpdate(
                budgetId,
                {
                    $set: { budgetAmount: newBudget },
                    $set: { transactionsHistoric: transaction },


                },

            );
        }

   
 

        
        // console.log('transaction history saved');

        next();
    } catch (error) {
        console.error('Error updating transaction history:', error);
        return res.status(500).json({ error: 'Error ' });
    }
}

module.exports = budgetUpdater;
