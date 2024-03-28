const Budget = require('../models/old/budget');
const jwt = require('jsonwebtoken');
const Decimal = require('decimal.js');
require('dotenv').config();

async function budgetUpdater(req, res, next) {
    try {
        const { item, budgetId, transactionType } = req.body;
        const user = req.user;

        // Calculate the total
        const { quantity, price, unit, itemName } = item;
        const total = Decimal(quantity).times(price);

        // Find the budget from the database using the budgeId
        const budget = await Budget.findById(budgetId);

        // console.log('phase 1 completed');
        if (!budget) {
            return res.status(404).json({ error: 'User not found' });
        }

        const previousAmount = budget.budgetAmount;
        const amountChanged = total.toNumber();

        const newBudget = transactionType === 'added' ? previousAmount + amountChanged : (transactionType === 'reduced' ? previousAmount - amountChanged : previousAmount);

        const transaction = {
            userId: user.id,
            transactionType,
            previousAmount,
            amountChanged,
            newAmount: newBudget,
            userName: user.name,
            userTel: user.tel,
            item,
        };

        // console.log('phase 2 completed');


        await Budget.findByIdAndUpdate(
            budgetId,
            {
                $set: { budgetAmount: newBudget},
                $push: { transactionsHistoric: transaction },

            }
        );

        // console.log('phase 2 completed');

        // console.log('Transaction history saved');

    } catch (error) {
        console.error('Error updating transaction history:', error);
        return res.status(500).json({ error: 'Error' });
    }
}

module.exports = budgetUpdater;
