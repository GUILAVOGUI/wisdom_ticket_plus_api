const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopOwnerName: {
        type: String,
        required: true,
        unique: true
    },
    shopName: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        name: String,
        price: Number,
        stock: Number,
        image: String,
        history: [{
            userName: String,
            quantity: Number,
            date: Date
        }]
    }],
    shopPartners: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String
    }]
});

// Method to add a partner to the shop
shopSchema.methods.addPartner = async function (userId, name) {
    const partner = { userId, name };
    this.shopPartners.push(partner);
    await this.save();
    return partner;
};

// Method to remove a partner from the shop
shopSchema.methods.removePartner = async function (userId) {
    this.shopPartners = this.shopPartners.filter(partner => !partner.userId.equals(userId));
    await this.save();
};

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
