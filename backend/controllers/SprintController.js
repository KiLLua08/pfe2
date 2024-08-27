const Sprint = require('../models/Sprint');

const Projet = require('../models/Projet');
const UserStory = require('../models/UserStory');
// Get all sprints
const getAllSprints = async (req, res) => {
    const { projetId } = req.params; // Get the project ID from the request parameters

    try {
        const sprints = await Sprint.findAll({
            where: {
                projetId: projetId, // Filter sprints by the provided project ID
            },
            include: [
                {
                    model: Projet,
                    as: 'projet', // Include the associated project
                },
                {
                    model: UserStory,
                    as: 'userStories', // Include the associated user stories
                },
            ],
            order: [['id', 'ASC']] // Order by id in ascending order
        });
        res.json(sprints); // Return all the sprints for the specified project
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sprints', error: error.message });
    }
};

// Get a single sprint by ID
const getSprintById = async (req, res) => {
    const { id } = req.params;
    try {
        const sprint = await Sprint.findByPk(id, {
            include: 'projet' // Include related projet data if needed
        });
        if (sprint) {
            res.json(sprint);
        } else {
            res.status(404).json({ message: 'Sprint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sprint', error: error.message });
    }
};

// Create a new sprint
const createSprint = async (req, res) => {
    const { projetId, numero, nom, description, dateDebut, dateFin, statut, priorite } = req.body;
    try {
        const newSprint = await Sprint.create({
            projetId,
            numero,
            nom,
            description,
            dateDebut,
            dateFin,
            statut,
            priorite
        });
        res.status(201).json(newSprint);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sprint', error: error.message });
    }
};

// Update an existing sprint
const updateSprint = async (req, res) => {
    const { id } = req.params;
    const { projetId, numero, nom, description, dateDebut, dateFin, statut, priorite } = req.body;
    try {
        const [updated] = await Sprint.update(
            { projetId, numero, nom, description, dateDebut, dateFin, statut, priorite },
            { where: { id } }
        );
        if (updated) {
            const updatedSprint = await Sprint.findByPk(id);
            res.json(updatedSprint);
        } else {
            res.status(404).json({ message: 'Sprint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating sprint', error: error.message });
    }
};

// Delete a sprint
const deleteSprint = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Sprint.destroy({ where: { id } });
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Sprint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sprint', error: error.message });
    }
};

const updateSprintId = async (req, res) => {
    const { id } = req.params; // UserStory ID from the request parameters
    const { newSprintId } = req.body; // New sprint ID from the request body

    try {


        // Update the sprintId in the UserStory where the ID matches
        const [updated] = await UserStory.update(
            { sprintId: newSprintId },
            { where: { id } }
        );

        if (updated) {
            res.json({ message: 'UserStory updated successfully' });
        } else {
            res.status(404).json({ message: 'UserStory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating sprint ID in UserStory', error: error.message });
    }
};

module.exports = {
    getAllSprints,
    getSprintById,
    createSprint,
    updateSprint,
    deleteSprint,
    updateSprintId,

};
