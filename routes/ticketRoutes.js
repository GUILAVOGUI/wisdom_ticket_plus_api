// ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');


const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../middleware/authMiddlewareUsers')



// Route for creating a new ticket
router.post('/tickets', authMiddlewareUsers,ticketController.createTicket);


// ******Admin******** Route to get all tickets
router.get('/tickets', authAdminMiddleware, ticketController.getAllTickets);


// Route to find tickets by user ID in listOfTicket guest _id
router.get('/tickets/user', authMiddlewareUsers,ticketController.findTicketsByUserId);



// Define route for updating a ticket inside the listOfTicket array
router.put('/tickets/:ticketId/guests/:guestId', authMiddlewareUsers,ticketController.updateTicket);

// Route to find and replace a guest by ticket ID and user ID
router.put('/tickets/replace-guest/:ticketId/:userId', ticketController.findAndReplaceGuest);


module.exports = router;
