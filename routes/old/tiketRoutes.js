// routes/userRoutes.js

const express = require('express');
const router = express.Router();


const budgetController = require('../controllers/budgetController');
const ticketControllers = require('../controllers/ticketControllers');
const authMiddlewareUsers = require('../../middleware/authMiddlewareUsers')
const authAdminMiddleware = require('../../middleware/authAdminMiddleware')
 





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



// Create Budget
router.post('/ticket', authMiddlewareUsers, ticketControllers.createTickets);


// Forgot Password
router.post('/forgotPasswordTicket', ticketControllers.createForgetPasswordTickets);



// get by admin
router.get('/ticket/listForAdmin', authMiddlewareUsers, checkAccess('getAllTicketByAdmin'), ticketControllers.getAllTicketByAdmin);



// get by user
router.get('/ticket/listForUser', authMiddlewareUsers, ticketControllers.getAllTicketByUser);



// Admin update ticke
router.put('/ticket/update/:id', authAdminMiddleware, ticketControllers.updateTicketById);




// Delete a goods tracking entry by ID
router.delete('/ticket/delete/:id', authMiddlewareUsers, checkAccess('deleteGoodsTracking'), ticketControllers.deleteTicket);




 

module.exports = router;
