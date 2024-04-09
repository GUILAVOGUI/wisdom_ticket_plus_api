const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Create a new location
router.post('/locations', locationController.createLocation);

// Get all locations
router.get('/locations', locationController.getLocations);

// Update a location
router.put('/locations/:id', locationController.updateLocation);

// Delete a location
router.delete('/locations/:id', locationController.deleteLocation);

module.exports = router;
