const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankContrllers');
const authAdminMiddleware = require('../../middleware/authAdminMiddleware');
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers');
const autthMiddlewareAdminPasswordChecker = require('../../middleware/autthMiddlewareAdminPasswordChecker');


// Middleware to check access for specific endpoints
const checkAccess = (requiredEndpoint) => {
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

// Create a new bank
router.post('/banks', bankController.createBank);

// Get all banks
router.get('/banks', authMiddlewareUsers,checkAccess('getAllClients'), bankController.getAllBanks); // *

router.get('/banksInfo', bankController.getAllBanksInfo);

// Get a specific bank by name
router.get('/banks/:name',  bankController.getBankByName);

// Update bank details
router.put('/banks/:name', bankController.updateBank);

// Delete a bank
router.delete('/banks/:name', bankController.deleteBank);




// Create a new withdrawal transaction
router.post('/banks/:name/transactions/withdraw', authMiddlewareUsers, bankController.createWithdrawal);

// Update a withdrawal transaction by ID
router.put('/banks/:name/transactions/withdraw/:id',  bankController.updateWithdrawal);

// Delete a withdrawal transaction by ID
router.delete('/banks/:name/transactions/withdraw/:id', autthMiddlewareAdminPasswordChecker,  bankController.deleteWithdrawal);

// Create a new deposit transaction
router.post('/banks/:name/transactions/deposit', authMiddlewareUsers, bankController.createDeposit);

// Update a deposit transaction by ID
router.put('/banks/:name/transactions/deposit/:id',  bankController.updateDeposit);

// Delete a deposit transaction by ID
router.delete('/banks/:name/transactions/deposit/:id', autthMiddlewareAdminPasswordChecker,  bankController.deleteDeposit);


module.exports = router;
