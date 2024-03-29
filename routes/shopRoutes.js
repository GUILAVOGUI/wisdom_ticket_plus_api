const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../middleware/authMiddlewareUsers')


// Shops Middlewares
const isShopOwnerMiddlewareShop = require('../middleware/shopMiddleware/isShopOwnerMiddlewareShop')


router.post('/shops', isShopOwnerMiddlewareShop, authMiddlewareUsers, shopController.createShop);
router.get('/shops', shopController.getAllShops);
router.get('/shops/:id', shopController.getShopById);
router.patch('/shops/:id', shopController.updateShopById);
router.delete('/shops/:id', shopController.deleteShopById);


// New endpoints for creating and updating items in a shop
router.post('/shops/:shopId/items', shopController.createItemInShop);
router.patch('/shops/:shopId/items/:itemId', shopController.updateItemInShop);



// Add - Delete Shop Parteners
router.post('/shop/:id/partners', shopController.addPartner);
router.delete('/shop/:id/partners/:partnerId', shopController.removePartner);


module.exports = router;
