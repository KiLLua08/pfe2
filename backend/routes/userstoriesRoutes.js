const express = require('express');
const router = express.Router();
const userStoryController = require('../controllers/ProjetController'); // Update the path as necessary

// Route to create a new user story
router.post('/', userStoryController.createUserStory);

// Route to get all user stories for a specific project
router.get('/projet/:projetId', userStoryController.getUserStoriesByProjectId);

// Route to get a user story by its ID
router.get('/:id', userStoryController.getUserStoryById);

// Route to update a user story by its ID
router.put('/:id', userStoryController.updateUserStory);

// Route to delete a user story by its ID
router.delete('/:id', userStoryController.deleteUserStory);

module.exports = router;
