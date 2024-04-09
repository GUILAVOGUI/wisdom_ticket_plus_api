const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacyController');

// Create a new privacy type
router.post('/privacy', privacyController.createPrivacy);

// Get all privacy types
router.get('/privacy', privacyController.getPrivacies);

// Update a privacy type
router.put('/privacy/:id', privacyController.updatePrivacy);

// Delete a privacy type
router.delete('/privacy/:id', privacyController.deletePrivacy);

module.exports = router;
