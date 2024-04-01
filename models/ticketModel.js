const mongoose = require('mongoose');

// Define a sub-schema for user information
const userInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String
});

// Define a sub-schema for user information
const guestInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestFirstName: String,
    guestLastName: String,
    guestEmail: String,
    guestPhoneNumber: String,
    guestDateOfBirth: Date,
    guestGender: String,
    
});

// Define a sub-schema for items
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    isItemScannedSuccess: {
        type: Boolean,
        default: false
    },
    userInfo: guestInfoSchema
});

// Define a sub-schema for events
const eventSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String
});

// Define a sub-schema for tickets
const ticketSchema = new mongoose.Schema({
    listOfTicket: [{
        ticketType: String,
        currency: String,
        price: Number,
        isTicketScannedSuccess: {
            type: Boolean,
            default: false
        },
        guest:guestInfoSchema,
    }],
    ticketOwner: userInfoSchema,
    totalAmount: Number,
    event: eventSchema,
    items: [itemSchema],
    totalShoppingAmount: Number,
    onResell: Boolean,
    promoCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromoCode'
    },
    ticketStatus: ({
        type: String,
        default: 'Approved'
    })
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
