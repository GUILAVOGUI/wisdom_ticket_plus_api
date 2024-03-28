const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: String,
    topicsOfInterest: [String],
    type: {
        type: String,
        enum: ['Super Admin', 'Admin', 'Agent Monitoring', 'Organizer', 'Normal User'],
        default: 'Normal User'
    },
    purchaseHistory: [{
        shopName: String,
        item: String
    }],
    notifications: [String],
    complainHistory: [String],
    paymentMethod: [{
        bankName: String,
        number: String,
        expireDate: Date
    }],
    transactionHistory: [{
        type: String
    }],
    token: String // Add token field
});

// Hashing password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
