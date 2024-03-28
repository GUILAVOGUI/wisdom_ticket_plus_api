const mongoose = require('mongoose');

const productHistorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    action: { type: String, required: true },
    quantityChanged: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantityInStock: { type: Number, required: true },
    status: { type: String, required: false },
    dateRegisteredInSystem: { type: Date, default: Date.now },
    imagesLinks: [{
        type: String,
    }],
});

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    accessListOfUsersTel: [{ type: String }],
    designatedStoreManagerTel: [{ type: String }],
    products: [productSchema],
    history: [{
        customerName: { type: String, required: false },
        customerTel: { type: String, required: false },
        transactions: [productHistorySchema],
    }],
    imagebannerLink: [{
        type: String,
    }],
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
