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


// // Controller for getting shops owned by the user
// exports.getShopsByUserId = async (req, res) => {
//     try {
//         const userId = req.id;

//         // Find all shops where the shop owner matches the user's ID
//         const shops = await Shop.find({ shopOwner: userId });

//         res.status(200).json({ status: 'success', data: shops });
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message });
//     }
// };

// Controller for getting shops owned by the user
exports.getShopsByUserId = async (req, res) => {
    try {
        const userId = req.id;

        // Find all shops where the shop owner matches the user's ID
        // or the shopPartners array contains an object with the user's ID
        const shops = await Shop.find({
            $or: [
                { shopOwner: userId },
                { 'shopPartners.userId': userId }
            ]
        });

        res.status(200).json({ status: 'success', data: shops });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};




// Controller for getting a single shop by ID
exports.getShopById = async (req, res) => {
    try {
        const userId = req.id; // Assuming userId is available in req.id
        const shop = await Shop.findById(req.params.id);
        const user = await User.findById(userId);


        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }

        // Check if the requesting user is the shop owner
        if (String(shop.shopOwner) !== userId && user.type !== 'Admin' && user.type !=='Super Admin'  ) {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized access' });
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

    console.log('createItemInShop');
    try {
        const { name, price, image,currency, stocks } = req.body;
        const userId = req.id; // Assuming userId is available in req.id

        const shopId = req.params.shopId;
        const user = await User.findById(userId);

     
      
        const newItem = { name, price, image, stocks, currency };

        const shop = await Shop.findById(shopId);

        console.log(`${userId}`);
        console.log(`${shop.shopOwner}`);

        // if (userId !== shop.shopOwner ) {
        //     return res.status(404).json({ status: 'fail', message: 'not the shop Owner' });
        // }

        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }


        if (String(shop.shopOwner) !== String(userId)) {
            return res.status(404).json({ status: 'fail', message: 'not the shop Owner' });
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
        const userId = req.id; // Assuming userId is available in req.id
        const user = await User.findById(userId);
       
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }
        if (String(shop.shopOwner) !== userId) {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized access' });
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




// Controller for deleting an item from a shop by ID
exports.deleteItemInShop = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const itemId = req.params.itemId;
        const userId = req.id; // Assuming userId is available in req.id
        const user = await User.findById(userId);

        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ status: 'fail', message: 'Shop not found' });
        }
        if (String(shop.shopOwner) !== userId) {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized access' });
        }

        // Find the item by ID and delete it directly from the database
        const deletedItem = await Shop.findByIdAndUpdate(shopId, { $pull: { items: { _id: itemId } } }, { new: true });

        if (!deletedItem) {
            return res.status(404).json({ status: 'fail', message: 'Item not found' });
        }

        res.status(200).json({ status: 'success', message: 'Item deleted successfully', deletedItem });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};



// Controller for adding a new partner to a shop
exports.addPartner = async (req, res) => {
    console.log('addPartner');
    try {
        const { userId } = req.body;
        const tokenUserId = req.userId;
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

        console.log(`${tokenUserId}`);
        console.log(`${shop.shopOwner}`);

        if (String(shop.shopOwner) !== String(tokenUserId)) {
            return res.status(404).json({ status: 'fail', message: 'Not the shop owner' });
        }

        // Check if the userId already exists as a partner in the shop
        const existingPartner = shop.shopPartners.find(partner => String(partner.userId) === String(userId));
        if (existingPartner) {
            return res.status(400).json({ status: 'fail', message: 'User is already a partner in the shop' });
        }

        // Add the partner to the shop
        shop.shopPartners.push({ userId, name: user.name });
        await shop.save();

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