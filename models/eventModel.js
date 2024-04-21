const mongoose = require('mongoose');



// Define a sub-schema for the ticket details
// const ticketSchema = new mongoose.Schema({
//     type: String,
//     price: Number,
//     availableAmount: Number
// });

// Define a sub-schema for the validity details
// const validitySchema = new mongoose.Schema({
//     type: String,       // Type of ticket the promo will apply to
//     startDate: Date,    // Start date of validity period
//     endDate: Date       // End date of validity period
// });


// Define a sub-schema for the items
// const itemSchema = new mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId for the item
//     name: String,
//     price: Number,
//     quantity: Number
// });

// Define a sub-schema for revenue with currency
const revenueSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: false
    },
    currency: {
        type: String,
        required: false
    }
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


const validitySchema = new mongoose.Schema({
    type: String,
    startDate: Date,
    endDate: Date
});

const ticketSchema = new mongoose.Schema({
    type: String,
    price: Number,
    availableAmount: Number
});

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    currency: String,
    image: String
});

const promoSchema = new mongoose.Schema({
    code: String,
    status: String,
    firstAmount: Number,
    quantity: Number,
    reductionAmount: Number,
    validity: validitySchema
});


const eventSchema = new mongoose.Schema({
    eventDetails: {
        imageLink: String,
        eventName: String,
        isOnline: Boolean,
        onlineLink: String,
        category: String,
        startDate: Date,
        startDateTime: String,
        startDateTimeEnd: String,
        endDate: Date,
        endDateTime: String,
        endDateTimeEnd: String,
        startTime: String,
        endTime: String,
        location: String,
        maximumCapacity: Number,
        tags: [String],
        eventDescription: String,
        ticketPrices: [ticketSchema],
        dateSalesStart: Date,
        dateSalesEnd: Date
    },
    creationDate: { type: Date, default: Date.now },
    status: {
        type: String,

    },


    privacy: {
        privacyText: String
    },
    addons: {
        items: [itemSchema]
    },
    share: {
        socialMediaLinks: [String]
    },
    promo: {
        promoCodes: [promoSchema]
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerProfileImage: {
        type: String
    },
    shopPartners: [{
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop'
        },
        requestStatus: String,
        items: [itemSchema] // Array of items with MongoDB ObjectId
    }],
    purchaseCondition: String,
    attendeesFeedback: [{
        userInfo: userInfoSchema, // Sub-schema for user information
        content: String,
        feebackStatus: {
            type: String,
            default: 'Approved'
        }
    }],
    attendeesRates: [{
        userInfo: userInfoSchema , // Sub-schema for user information
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
   
    ticketsList: [{
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        },
        ticketStatus: String,   // Ticket status field
        userInfo: userInfoSchema  // Sub-schema for user information
    }],
    teamMember: [{
        memberStatus: String,   // Ticket status field
        memberRole: String,   // Ticket status field
        userInfo: userInfoSchema  // Sub-schema for user information
    }],
  
    ticketsSold: {
        type: Number,
        required: false
    },
    revenues: [revenueSchema], // Array of revenues with currency

    eventImages: [String] ,// Array of image links
    tags: [String] // Array of image links
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
