const mongoose = require('mongoose');


// Define the model schema
const transferSchema = new mongoose.Schema({
    sender: {
        name: String,
        phone: String,
        address: {
            country: String,
            city: String,
        },
    },
    receiver: {
        name: String,
        phone: String,
        address: {
            country: String,
            city: String,
        },
    },
    transferAmount: Number,
    transferFees: Number,
    totalTranfer: Number,
    transferStatus: { type: String, default: 'Processing' },

    withdrawAmount: Number,
    currentRate: Number,
    depositCurrency: String,
    depositStatus: { type: String, default: 'Received' },
    withdrawCurrency: String,
    withdrawStatus: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now },


    
});

const Transfers = mongoose.model('Transfers', transferSchema);

module.exports = Transfers;
