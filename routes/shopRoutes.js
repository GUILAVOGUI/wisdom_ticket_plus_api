const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../middleware/authMiddlewareUsers')


// Shops Middlewares
const isShopOwnerMiddlewareShop = require('../middleware/shopMiddleware/isShopOwnerMiddlewareShop')


router.post('/shops', isShopOwnerMiddlewareShop, authMiddlewareUsers, shopController.createShop);
router.get('/shops', authAdminMiddleware, shopController.getAllShops);
router.get('/shops/:id', authMiddlewareUsers,shopController.getShopById);
router.patch('/shops/:id', isShopOwnerMiddlewareShop, shopController.updateShopById);
router.delete('/shops/:id', isShopOwnerMiddlewareShop, shopController.deleteShopById);


// New endpoints for creating and updating items in a shop
router.post('/shops/:shopId/items', isShopOwnerMiddlewareShop,authMiddlewareUsers, shopController.createItemInShop);
router.put('/shops/:shopId/items/:itemId', isShopOwnerMiddlewareShop, authMiddlewareUsers, shopController.updateItemInShop);
router.delete('/shops/:shopId/items/:itemId', isShopOwnerMiddlewareShop, authMiddlewareUsers, shopController.deleteItemInShop); // New endpoint for deleting an item


// Define route for getting shops owned by the user
router.get('/ownershops', authMiddlewareUsers, shopController.getShopsByUserId);


// Add - Delete Shop Parteners
router.post('/shop/:id/partners', shopController.addPartner);
router.delete('/shop/:id/partners/:partnerId', shopController.removePartner);


module.exports = router;
