const Shop = require('../models/shopModel');
const User = require('../models/userModel');

// Controller for creating a new shop
exports.createShop = async (req, res) => {
    try {
        const { shopName, shopPartners } = req.body;
        const userId = req.id;
        const shopOwnerName = req.userName

        // Assuming you have the User model imported
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        // // Validate if all shop partners exist and fetch their names
        // const partnerIds = shopPartners.map(partner => partner.userId);
        // const partners = await User.find({ _id: { $in: partnerIds } });
        // if (partners.length !== shopPartners.length) {
        //     return res.status(404).json({ status: 'fail', message: 'One or more shop partners not found' });
        // }

        // // Map partner IDs to partner names
        // const partnersWithNames = shopPartners.map(partner => {
        //     const partnerInfo = partners.find(p => p._id.equals(partner.userId));
        //     return { userId: partner.userId, name: partnerInfo ? partnerInfo.name : 'Unknown' };
        // });

        const shop = await Shop.create({
            shopOwner: userId,
            shopOwnerName: shopOwnerName,
            shopName,
            items: [],
        });

        res.status(201).json({ status: 'success', data: shop });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


// Controller for getting all shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json({ status: 'success', data: shops });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for getting a single shop by ID
exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }
        res.status(200).json({ status: 'success', data: shop });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Controller for updating a shop by ID
exports.updateShopById = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }
        res.status(200).json({ status: 'success', data: shop });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for deleting a shop by ID
exports.deleteShopById = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndDelete(req.params.id);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// Controller for creating a new item in a shop
exports.createItemInShop = async (req, res) => {
    try {
        const { name, price, image, stocks } = req.body;
        const shopId = req.params.shopId;

        const newItem = { name, price, image, stocks };

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }

        shop.items.push(newItem);
        await shop.save();

        res.status(201).json({ status: 'success', data: newItem });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for updating an item in a shop by ID
exports.updateItemInShop = async (req, res) => {
    try {
        const { name, price, image, stocks } = req.body;
        const shopId = req.params.shopId;
        const itemId = req.params.itemId;

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }

        const item = shop.items.id(itemId);
        if (!item) {
            return res.status(404).json({ status: 'fail', message: 'Item not found' });
        }

        if (name) item.name = name;
        if (price) item.price = price;
        if (image) item.image = image;
        if (stocks) item.stocks = stocks;

        await shop.save();

        res.status(200).json({ status: 'success', data: item });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};




// Controller for adding a new partner to a shop
exports.addPartner = async (req, res) => {
    try {
        const { userId } = req.body;
        const shopId = req.params.id;

        // Fetch the user details to get the partner's name
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        // Find the shop and add the partner
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }

        await shop.addPartner(userId, user.name);

        res.status(200).json({ status: 'success', message: 'Partner added to the shop' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Controller for removing a partner from a shop
exports.removePartner = async (req, res) => {
    try {
        const shopId = req.params.id;
        const partnerId = req.params.partnerId;

        // Find the shop and remove the partner
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }

        await shop.removePartner(partnerId);

        res.status(200).json({ status: 'success', message: 'Partner removed from the shop' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};