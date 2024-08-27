const express = require('express');
const router = express.Router();
const ProjetController = require('../controllers/ProjetController'); // Adjust the path according to your project structure
const authMiddleware = require("../middleware/authMiddleware");
// Create a new project
router.post('/', ProjetController.createProjet);

// Get a single project by ID
router.get('/:id', ProjetController.getProjetById);

// Get all projects
router.get('/', ProjetController.getAllProjets);

// Update a project by ID
router.put('/:id', ProjetController.updateProjet);

// Delete a project by ID
router.delete('/:id', ProjetController.deleteProjet);

module.exports = router;
