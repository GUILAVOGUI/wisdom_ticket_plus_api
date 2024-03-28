const mongoose = require('mongoose');

 

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: false }, // ID of the user doing the transaction
    transactionType: { type: String, enum: ['added', 'reduced'], required: false }, // Type of transaction
    previousAmount: { type: Number, required: false },
    amountChanged: { type: Number, required: false },
    newAmount: { type: Number, required: false },
    timestamp: { type: Date, default: Date.now },
    userName: { type: String, required: false },
    userTel: { type: String, required: false },
    otherDetail: { type: String, required: false },
    item: {
        itemName: String,
        unit: String,
        quantity: Number,
        price: Number,
        total: Number,
    },
 

});

const budgetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'on', required: false },
    budgetAmount: { type: Number, default: 0 },
    transactionsHistoric: [transactionSchema], // Add the transaction history field
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
