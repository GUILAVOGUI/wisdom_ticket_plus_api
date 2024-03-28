const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');

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


// Create a new client
router.post('/clients', authMiddlewareUsers, clientController.createClient);


// Add credit to client balance
router.post('/clients/:id/credit', authMiddlewareUsers, clientController.creditBalance);

// Add remboursement to reduce client balance
router.post('/clients/:id/remboursement', authMiddlewareUsers,clientController.remboursementBalance);




// Get all clients
router.get('/clients', authMiddlewareUsers, checkAccess('getAllClients'), clientController.getAllClients); // *

// Get a specific client by ID
router.get('/clients/:id', clientController.getClientById);

// Update a client by ID
router.put('/clients/:id', clientController.updateClientById);

// Delete a client by ID
router.delete('/clients/:id', autthMiddlewareAdminPasswordChecker, clientController.deleteClientById);

module.exports = router;
