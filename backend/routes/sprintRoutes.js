const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/SprintController');
const authMiddleware = require("../middleware/authMiddleware");
// Get all sprints
router.get('/projet/:projetId', authMiddleware, sprintController.getAllSprints);

// Get a single sprint by ID
router.get('/:id', authMiddleware, sprintController.getSprintById);

// Create a new sprint
router.post('/', authMiddleware, sprintController.createSprint);

// Update an existing sprint
router.put('/:id', authMiddleware, sprintController.updateSprint);

// Delete a sprint
router.delete('/:id', authMiddleware, sprintController.deleteSprint);

router.patch('/updatesprintid/:id', sprintController.updateSprintId);

module.exports = router;
