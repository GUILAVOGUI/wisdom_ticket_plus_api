const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    userName: {
        type: String,
        required: false,
    },
    userTel: {
        type: String,
        required: false,
    },
    transactionCurrency: {
        type: String,
        required: true,
    },
    transactionComments: {
        type: String,
        required: false,
    },

    depositer: {
        type: String,
        required: false,
    },

    receiver: {
        type: String,
        required: false,
    },

    date: {
        type: Date,
        default: Date.now,
    },
    // bankBranchLocation: {
    //     type: String,
    //     required: true,
    // },
    transactionImagesLinks: [{
        type: String,
        required: false,
    }],
});

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    imagebannerLink: [{
        type: String,
        default: 'https://res.cloudinary.com/dxkvkr8ns/image/upload/v1702405031/emyh4kcva3jexxk2v43s.png',

    }],
    balances: {
        USD: {
            type: Number,
            required: true,
            default: 0,
        },
        GNF: {
            type: Number,
            required: true,
            default: 0,
        },
        EUR: {
            type: Number,
            required: true,
            default: 0,
        },
        // Add more currencies as needed
    },
    transactions: {
        withdraw: [transactionSchema],
        deposit: [transactionSchema],
    },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
