const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

// Create a new client
router.post('/clients', clientsController.createClient);

// Get all clients
router.get('/clients', clientsController.getAllClients);

// Get a single client by ID
router.get('/clients/:id', clientsController.getClientById);

// Update a client by ID
router.put('/clients/:id', clientsController.updateClient);

// Delete a client by ID
router.delete('/clients/:id', clientsController.deleteClient);

module.exports = router;
