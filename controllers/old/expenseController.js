const Expense = require('../../models/old/expenses');

const budgetUpdateMiddleware = require('../../middleware/budgetUpdateMiddleware');
const budgetUpdateMiddlewareOnDeleteAction = require('../../middleware/budgetUpdateMiddlewareOnDeleteAction');


const validateFields = (obj) => {
    const allowedFields = ['type', 'budgetId', 'byWho', 'budgetName', 'fraisDeRetrait','fraisDeDepot', 'modeDePaiement', 'transactionType', 'transactionType', 'item', 'imagesLinks', 'status', 'toWhom', 'comment'];
    for (const key in obj) {
        if (!allowedFields.includes(key)) {
            return false; // Found an invalid field
        }
    }
    return true; // All fields are valid
};
const createExpense = async (req, res) => {
    try {
        // Validate the request body fields
        const isValidFields = validateFields(req.body);
        const transactionType = req.body.transactionType;

        if (!transactionType || (transactionType !== 'reduced' && transactionType !== 'added')) {
            return res.status(400).json({ errors: 'Invalid transaction type' });
        }


        if (!isValidFields) {
            return res.status(400).json({ error: 'Invalid fields in the request body.' });
        }

        // console.log(req.body.imagesLinks); // Add this line for debugging

        // Calculate the total
        const { quantity, price, unit, itemName } = req.body.item;
        const total = quantity * price;


        // Extract user information from the authentication token
        const userId = req.user.id; // Assuming req.user.id contains the user's ID
        const userName = req.user.name; // Assuming req.user.name contains the user's name

        // Extract imagesLinks from the request body (if provided)
        const imagesLinks = req.body.imagesLinks || []; // Default to an empty array if not provided

        // Create the new Expense object
        const newExpense = new Expense({
            createdByWho: {
                id: userId,
                name: userName,
            },
            type: req.body.type,
            item: {
                itemName: itemName,
                unit: unit,
                quantity: quantity,
                price: price,
                total: total,
            },
            status: req.body.status,
            imagesLinks: imagesLinks, // Save the imagesLinks
            byWho: req.body.byWho,
            toWhom: req.body.toWhom,
            comment: req.body.comment,
            budgetId: req.body.budgetId,
            budgetName: req.body.budgetName,
            transactionType: req.body.transactionType,
            modeDePaiement: req.body.modeDePaiement,
            fraisDeRetrait: req.body.fraisDeRetrait,
            fraisDeDepot: req.body.fraisDeDepot,

        });

        // Save the new expense
        await newExpense.save();

        await budgetUpdateMiddleware(req, res); // Await the completion of addWallet


        // console.log(newExpense);

        // console.log('Expense saved successfully');

        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// See all the Expense

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find(); // Retrieve all expenses from the database
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}




// Admin Update user ID

const UpdateExpensesById = async (req, res) => {
    console.log('Updating');
    try {
        const updates = req.body;
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'expense not found' });
        }


        // Calculate the total
        const { quantity, price, unit, itemName } = updates.item
        const total = quantity * price;

     
      updates.item.total = total;

 
        Object.assign(expense, updates);
        await expense.save();

        // Prepare the response object including the updated 'accessList'
        const responseUser = {
            _id: expense._id,
            name: expense.item.itemName,
            total: expense.item.total,
        };

        res.json(responseUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


// Delete a expenses by ID (requires admin role)
const deleteExpensesById = async (req, res) => {
    try {

        // console.log(req.params.id);
        // console.log(req.body.expenseData);


        const deletedExpenses = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpenses) {
            // console.log('User not found:', req.params.id);
            return res.status(404).json({ error: 'Expenses not found' });
        }

        await budgetUpdateMiddlewareOnDeleteAction(req, res); // Await the completion of addWallet


        // console.log('Expenses deleted successfully:', deletedExpenses._id);
        res.status(200).json({ message: 'Expenses deleted successfully' });
    } catch (error) {
        // console.error( error);
        res.status(500).json({ error: 'Failed to delete expenses' });
    }
};



module.exports = {
    createExpense,
    getAllExpenses,
    UpdateExpensesById,
    deleteExpensesById

};
