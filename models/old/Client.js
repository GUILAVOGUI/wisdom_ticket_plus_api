const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    unitPrice: Number,
    quantity: Number,
});

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    balance: {
        USD: {
            type: Number,
            default: 0,
        },
        GNF: {
            type: Number,
            default: 0,
        },
        EUR: {
            type: Number,
            default: 0,
        },
    },
    balanceTransactions: [
        {
            transactionType: String,
            amount: Number,
            date: { type: Date, default: Date.now },
            dateRegisterInSystem: { type: Date, default: Date.now },
            products: [productSchema], // Array of products with name, unitPrice, and quantity
            status: String,
            registerBy: String,
            currency: String,
            manualAmount: Number, // New field
            comment: String, // New field
            imagebannerLink: [{
                type: String
            }],
        },
    ],
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
