const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    priceRange: {
        regular: Number,
        VIP: Number,
        VVIP: Number
    },
    numberOfPurchase: {
        type: Number,
        default: 0
    },
    numberOfLikes: {
        type: Number,
        default: 0
    },
    onPromo: {
        type: Boolean,
        default: false
    },
    promoCodes: [{
        code: String,
        validity: {
            period: Date,
            firstAmount: Number,
            quantity: Number,
            reductionAmount: Number
        }
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    shopPartners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }],
    purchaseCondition: String,
    attendeesFeedback: [{
        userInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String
    }],
    attendeesRates: [{
        userInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rate: Number
    }],
    shares: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    accessList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ticketsList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    coverImage: {
        type: String,
        required: true
    },
    eventImages: [String] // Array of image links
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
