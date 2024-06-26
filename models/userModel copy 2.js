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

// Define a sub-schema for company profile
const companyProfileSchema = new mongoose.Schema({
    logoImageLink: String,
    name: String,
    address: String,
    contactPhone: String,
    contactEmail: String
});

// Define a sub-schema for company profile
const userPreferenceSchema = new mongoose.Schema({
    language: {
        type: String,
        default: 'English'
    },
    region: {
        type: String,
        default: ''
    },
    timezone: {
        type: String,
        default: 'UTC'
    }
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
    status: {
        type: String,

    },
    inAdminTeam: {
        type: Boolean,
        default: false
    },


    userProfileImage: {
        type: String,
        default: 'https://res.cloudinary.com/ds1hlry5u/image/upload/v1713581113/qeyflpgbbjvgfejcm8gc.png'
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
        enum: ['Super_Admin', 'Admin', 'Agent_Monitoring', 'Organizer', 'ShopOwner', 'Normal_User'],
        default: 'Normal_User'
    },
    purchaseHistory: [{
        shopName: String,
        item: String
    }],
    teamMember: [{
        memberStatus: String,   
        userRole: String,   
        userInfo: userInfoSchema  // Sub-schema for user information
    }],
    adminTeamMember: [{
        memberStatus: String,   
        userRole: String,   
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

    billingPlan: String,
    actions: [String],// Add actions field
    linkedAccount: [linkedAccountSchema], // Array of linked accounts
    companyProfile: companyProfileSchema ,// Add company profile field
    userPreference: userPreferenceSchema
});

const User = mongoose.model('User', userSchema);

module.exports = User;
