const mongoose = require('mongoose');



// Define a sub-schema for the ticket details
const ticketSchema = new mongoose.Schema({
    type: String,
    price: Number,
    availableAmount: Number
});

// Define a sub-schema for the validity details
const validitySchema = new mongoose.Schema({
    type: String,       // Type of ticket the promo will apply to
    startDate: Date,    // Start date of validity period
    endDate: Date       // End date of validity period
});


// Define a sub-schema for the items
const itemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId for the item
    name: String,
    price: Number,
    quantity: Number
});

// Define a sub-schema for revenue with currency
const revenueSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    }, 
    EndTime: {
        type: String,
        required: true
    },
    maximumCapacity: {
        type: Number,
        required: true
    }, 
    address: {
        type: String,
        required: true
    },
    priceRange: [ticketSchema] ,
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
        status: String,
        firstAmount: Number,
        quantity: Number,
        reductionAmount: Number,
        validity: {
            type: validitySchema,  // Sub-schema for validity details
           },

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
    coverImage: {
        type: String,
        required: true
    },
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
