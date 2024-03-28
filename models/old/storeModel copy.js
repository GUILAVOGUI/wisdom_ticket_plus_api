const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantityInStock: { type: Number, required: true },
    type: { type: String, required: false },
    status: { type: String, required: false },
    minQuantityForAlert: { type: Number, required: false },
    expireDate: { type: Date, required: false },
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
    imagebannerLink: [{
        type: String,

    }],
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
