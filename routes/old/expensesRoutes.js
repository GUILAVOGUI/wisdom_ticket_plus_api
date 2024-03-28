const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');


const checkAccess = (requiredEndpoint) => {
    return (req, res, next) => {
        const user = req.user; // Assuming req.user contains user information including accessList

        if (!user || !user.accessList) {
            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!user.accessList.includes('allAccess') && !user.accessList.includes(requiredEndpoint)) {
            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }

        // User has access to the required endpoint, proceed to the next middleware
        next();
    };
};


// Middlewares
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')


// Create a new expense
router.post('/expenses/create', authMiddlewareUsers, checkAccess('createExpense'), expenseController.createExpense);

// Get all Expenses
router.get('/expenses/displayAll', authMiddlewareUsers, checkAccess('getAllExpenses'), expenseController.getAllExpenses);




// update an Expense
router.put('/expenses/update/:id', authMiddlewareUsers, checkAccess('UpdateExpensesById'), expenseController.UpdateExpensesById);


// Delete an expense by ID
router.delete('/expenses/delete/:id', authMiddlewareUsers, checkAccess('deleteExpensesById'),  expenseController.deleteExpensesById);






// // Get a specific expense by ID
// router.get('/expenses/:id', expenseController.getExpenseById);

// // Update an expense by ID
// router.put('/expenses/:id', expenseController.updateExpense);


// // Get all expenses
// router.get('/expenses', expenseController.getAllExpenses);

module.exports = router;
