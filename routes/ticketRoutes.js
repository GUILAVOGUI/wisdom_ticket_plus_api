// ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');


const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../middleware/authMiddlewareUsers')



// Route for creating a new ticket
router.post('/tickets', authMiddlewareUsers,ticketController.createTicket);



// Define route for updating a ticket inside the listOfTicket array
router.put('/tickets/:ticketId/guests/:guestId', authMiddlewareUsers,ticketController.updateTicket);



module.exports = router;
