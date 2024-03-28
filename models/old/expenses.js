const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    createdByWho: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
    },
    type: {
        type: String,
        required: true,
    },
    item: {
        itemName: String,
        unit: String,
        quantity: Number,
        price: Number,
        total: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    }, 
    imagesLinks: [{
        type: String,
        required: false,
    }],
    status: {
        type: String,
        enum: ['completed', 'onGoing', 'pending', 'cancelled'],
        default: 'pending',
    },
    byWho: String,
    toWhom: String,
    modeDePaiement: String,
    fraisDeRetrait: Number,
    fraisDeDepot: Number,
    comment: String,
    budgetId: { type: String, required: false },
    budgetName: { type: String, required: false },
    transactionType: { type: String, required: false },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
