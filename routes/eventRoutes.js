const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const authMiddlewareUsers = require('../middleware/authMiddlewareUsers')


const isEventOwnerMiddlewareEvent = require('../middleware/eventMiddlewares/isEventOwnerMiddlewareEvent')



router.post('/events', isEventOwnerMiddlewareEvent,authMiddlewareUsers, eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', isEventOwnerMiddlewareEvent, authMiddlewareUsers, eventController.updateEventById);
router.delete('/events/:id', isEventOwnerMiddlewareEvent, authMiddlewareUsers, eventController.deleteEventById);


// Adding/deleting attendeesFeedback
router.post('/events/:eventId/attendeesFeedback', eventController.addAttendeesFeedback);
router.delete('/events/:eventId/attendeesFeedback/:feedbackId', isEventOwnerMiddlewareEvent, eventController.deleteAttendeesFeedback);

// Adding/deleting attendeesRates
router.post('/events/:eventId/attendeesRates', authMiddlewareUsers,eventController.addAttendeesRate);
router.delete('/events/:eventId/attendeesRates/:rateId', eventController.deleteAttendeesFeedback);

// Define route for deleting attendeesRates

// Adding/updating/deleting promoCodes
router.post('/events/:eventId/promoCodes', authMiddlewareUsers, isEventOwnerMiddlewareEvent, eventController.addPromoCode);
router.delete('/events/:eventId/promoCodes/:promoId', eventController.deletePromoCode);
// Define route for updating promoCodes

// Adding/deleting shopPartners
router.post('/events/:eventId/shopPartners', eventController.addShopPartner);
router.delete('/events/:eventId/shopPartners/:shopId', eventController.deleteShopPartner);

// Routes for adding and deleting items in ticketsList
router.post('/events/:eventId/tickets', eventController.addTicketToList);
router.delete('/events/:eventId/tickets/:ticketId', eventController.deleteTicketFromList);

// Routes for adding and deleting team members
router.post('/events/:eventId/team-members', authMiddlewareUsers,eventController.addTeamMember);
router.delete('/events/:eventId/team-members/:userId', eventController.deleteTeamMember);

// Routes for adding and deleting revenues
router.post('/events/:eventId/revenues', eventController.addRevenue);
router.delete('/events/:eventId/revenues/:revenueId', eventController.deleteRevenue);



// New route to get events for a specific user
router.post('/events/user', eventController.getUserEvents);









module.exports = router;
