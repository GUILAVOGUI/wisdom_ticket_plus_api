// models/GoodsTracking.js
const mongoose = require('mongoose');

const goodsTrackingSchema = new mongoose.Schema({
    goodsName: {
        type: String,
        required: true,
    },
    goodsDescription: String,
    goodsCountryOrigin: String,
    goodsCountryDestination: String,
    goodsType: String,
    goodsQuantity: Number,
    goodsTotalWeight: Number,
    goodsTotalCBM: Number,
    goodsImagesLinks: [{
        type: String,
        required: false,
    }],
    goodsShippingMode: {
        type: String,
        enum: ['Flight','Boat'],
        default: 'packing',
    },
    goodsCurrentCountrylocation: {
        type: String,
        enum: ['Guinea', 'China', 'searching', 'cancelled', 'arrived'],
        default: 'packing',
    },
    clientName: String,
    clientTel: String,
    clientAddress: String,
    clientTotalToPaidAmount: Number,
    clientPaidAmount: Number,
    clientRelicatAmount: Number,
    clientPaymentStatus: {
        type: String,
        enum: ['Paid', 'Not-Paid','Partially-Paid'],
    },
    clientReceptImagesLinks: [{
        type: String,
        required: false,
    }],
   
    status: {
        type: String,
        // enum: ['shipping', 'packing', 'searching', 'cancelled', 'arrived', 'Received By Client', 'warehouse' ],
        default: 'packing',
    },
    forwarderName: String,
    forwarderTel: String,
    forwarderPaymentAmount: Number,
    forwarderPaidAmount: Number,
    forwarderRelicatAmount: Number,
    forwarderPayementStatus: {
        type: String,
        enum: ['Paid', 'Not-Paid','Partially-Paid'],
    },
 
    forwarderReceptImagesLinks: [{
        type: String,
        required: false,
    }],
    adminComment: String,
    forwarderComment: String,
    client: String,
    goodsCreationdate: {
        type: String
        // default: Date.now,
    }, 
    deliveredToClientDate: {
        type: String
    }, 
    expeditionDate: {
        type: String
    }, 
    receptionInWareHouseDate: {
        type: String
    }, 

    // Add more fields as needed
});

module.exports = mongoose.model('GoodsTracking', goodsTrackingSchema);
