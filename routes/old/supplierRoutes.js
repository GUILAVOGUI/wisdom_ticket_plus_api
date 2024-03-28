const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/SupplierController');

const authAdminMiddleware = require('../../middleware/authAdminMiddleware');
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers');
const autthMiddlewareAdminPasswordChecker = require('../../middleware/autthMiddlewareAdminPasswordChecker');


// Middleware to check access for specific endpoints
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

        // User has access to the required endpoint, proceed to the next middleware
        next();
    };
};


// Create a new supplier
router.post('/suppliers', authMiddlewareUsers, checkAccess('createSupplier'),  supplierController.createSupplier); // *


// Add credit to supplier balance
router.post('/suppliers/:id/credit', authMiddlewareUsers, supplierController.creditBalance);

// Add remboursement to reduce supplier balance
router.post('/suppliers/:id/remboursement', authMiddlewareUsers,supplierController.remboursementBalance);




// Get all suppliers
router.get('/suppliers', authMiddlewareUsers, checkAccess('getAllSuppliers'), supplierController.getAllSuppliers); // *

// Get a specific supplier by ID
router.get('/suppliers/:id', supplierController.getSupplierById);

// Update a supplier by ID
router.put('/suppliers/:id', supplierController.updateSupplierById);

// Delete a supplier by ID
router.delete('/suppliers/:id', autthMiddlewareAdminPasswordChecker, checkAccess('deleteSupplierById'), supplierController.deleteSupplierById); // *

module.exports = router;
