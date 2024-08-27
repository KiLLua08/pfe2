const express = require('express');
const router = express.Router();
const demandeClientController = require('../controllers/DemandeClientController');
const authMiddleware = require("../middleware/authMiddleware");
// Create a new DemandeClient
router.post('/', authMiddleware, demandeClientController.creerDemandeClient);

// Get all DemandeClients
router.get('/', authMiddleware, demandeClientController.getAllDemandeClients);

// Get a DemandeClient by ID
router.get('/:id', authMiddleware, demandeClientController.getDemandeClientById);

// Update a DemandeClient
router.put('/:id', authMiddleware, demandeClientController.updateDemandeClient);

// Delete a DemandeClient
router.delete('/:id', authMiddleware, demandeClientController.deleteDemandeClient);

module.exports = router;
