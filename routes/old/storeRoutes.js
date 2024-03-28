const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');



const authAdminMiddleware = require('../../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')
const autthMiddlewareAdminPasswordChecker = require('../../middleware/autthMiddlewareAdminPasswordChecker');






const checkAccess = (requiredEndpoint) => {
    console.log('checkAccess');

    return (req, res, next) => {
        const user = req.user; // Assuming req.user contains user information including accessList

        if (!user || !user.accessList) {
            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!user.accessList.includes('allAccess') && !user.accessList.includes(requiredEndpoint)) {
            // User does not have access to the required endpoint
            return res.status(403).json({ error: 'Access denied' });
        }
        console.log('have acess');

        // User has access to the required endpoint, proceed to the next middleware
        next();
    };
};




// Routes for Store resource
router.post('/stores', authMiddlewareUsers, checkAccess('createStore') , storeController.createStore); // *
router.get('/stores', authMiddlewareUsers, storeController.getAllStores); 
router.get('/stores/:id', storeController.getStoreById);
router.put('/stores/:id', authMiddlewareUsers, checkAccess('updateStoreById'), storeController.updateStoreById); // *

router.delete('/stores/:id', autthMiddlewareAdminPasswordChecker, checkAccess('deleteStoreById'), storeController.deleteStoreById); // *


// Route for store-level product transactions (POST)
router.post('/stores/:storeId/transactions', authMiddlewareUsers, storeController.postStoreProductTransactions);




// Routes for Product resource within a Store
router.post('/stores/:storeId/products', storeController.createProduct);
router.put('/stores/:storeId/products/:productId', storeController.updateProductById);
router.delete('/stores/:storeId/products/:productId', autthMiddlewareAdminPasswordChecker,storeController.deleteProductById);

module.exports = router;
