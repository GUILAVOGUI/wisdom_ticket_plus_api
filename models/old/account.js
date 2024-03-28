const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    balance: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['Expenses', 'Creance', 'Debt', 'Groupe Cotisation'],
        required: true
    },
    historic: [{
        amount: {
            type: Number,
            required: false
        },
        type: {
            type: String,
            enum: ['add', 'reduce'],
            required: false
        },
        personName: {
            type: String,
            required: false
        },
        personTel: {
            type: String,
            required: false
        },

        comment: {
            type: String,
            required: false
        },

        date: {
            type: Date,
            default: Date.now
        }
    }],
    members: [{
        name: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: false
        },
        remainToPay: {
            type: Number,
            default: 0,
            required: false
        },
        comment: {
            type: String,
            required: false,
            default: ''
        },
        status: {
            type: String,
            required: false,
            default: ''
        },
        address: {
            type: String,
            required: false,
            default: ''
        }
    }],
    createdBy: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    accessList: [{
        type: String
    }]
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
