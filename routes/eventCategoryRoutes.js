const express = require('express');
const router = express.Router();
const eventCategoryController = require('../controllers/eventCategoryController');

// Create a new event category
router.post('/eventcategory', eventCategoryController.createEventCategory);

// Get all event categories
router.get('/eventcategory', eventCategoryController.getEventCategories);

// Update an event category
router.put('/eventcategory/:id', eventCategoryController.updateEventCategory);

// Delete an event category
router.delete('/eventcategory/:id', eventCategoryController.deleteEventCategory);

module.exports = router;
