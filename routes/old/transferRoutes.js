const express = require('express');
const router = express.Router();
const transferControllers = require('../../controllers/old/transferControllers');
const authAdminMiddleware = require('../../middleware/authAdminMiddleware');
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers');

// Middleware to check access based on required endpoint
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

// Routes
router.post('/transfers', transferControllers.createTransfer);
router.get('/transfers', transferControllers.getAllTransfers);
router.get('/transfers/:id',  transferControllers.getTransferById);
router.put('/transfers/:id', transferControllers.updateTransfer);
router.delete('/transfers/:id', transferControllers.deleteTransfer);

module.exports = router;
