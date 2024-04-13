const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Define a sub-schema for linked account
const linkedAccountSchema = new mongoose.Schema({
    socialMediaName: String,
    link: String
});

// Define a sub-schema for user information
const userInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    phoneNumber: String,
    gender: String,
    address: String
});


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
        enum: ['Super_Admin', 'Admin', 'Agent_Monitoring', 'Organizer','ShopOwner', 'Normal_User'],
        default: 'Normal_User'
    },
    purchaseHistory: [{
        shopName: String,
        item: String
    }],
    teamMember: [{
        memberStatus: String,   // Ticket status field
        userInfo: userInfoSchema  // Sub-schema for user information
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
    token: String,// Add token field
    aboutUs: String,
    pageURL: String,
    creationDate: { type: Date, default: Date.now },

    billingPlan: String ,
    actions: [String],// Add actions field
    linkedAccount: [linkedAccountSchema] // Array of linked accounts
});

// Hashing password before saving to the database
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
