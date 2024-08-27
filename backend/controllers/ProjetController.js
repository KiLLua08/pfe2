const { Projet, Utilisateur, MembreEquipe, UserStory } = require('../models'); // Adjust the import according to your project structure
const sequelize = require('../config/database');  // Adjust the import according to your project structure


// Create a new project
exports.createProjet = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { nom, description, clientId, chefProjetId, dateDebut, dateFin, statut, budget, priorite, livrables, risques, jalons, teamMembers, teamLeader } = req.body;

        // Validate required fields
        if (!nom || !clientId || !chefProjetId || !dateDebut || !dateFin) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create the project
        const projet = await Projet.create({
            nom,
            description,
            clientId,
            chefProjetId,
            dateDebut,
            dateFin,
            statut,
            budget,
            priorite,
            livrables,
            risques,
            jalons,
        }, { transaction: t });

        // Create team members
        for (const member of teamMembers) {
            await MembreEquipe.create({
                projetId: projet.id,
                utilisateurId: member.id,
                role: member.role,
                chefEquipe: Number(teamLeader) === member.id ? true : null,
            }, { transaction: t });
        }

        await t.commit();
        res.status(201).json(projet);
    } catch (error) {
        await t.rollback();
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'An error occurred while creating the project' });
    }
};


// Get a single project by ID
exports.getProjetById = async (req, res) => {
    try {
        const { id } = req.params;

        const projet = await Projet.findByPk(id, {
            include: [
                {
                    model: Utilisateur,
                    as: 'client',
                    attributes: ['id', 'nom', 'prenom'] // Select specific fields
                },
                {
                    model: Utilisateur,
                    as: 'chefProjet',
                    attributes: ['id', 'nom', 'prenom'] // Select specific fields
                },
                {
                    model: MembreEquipe,
                    as: 'membresEquipe',
                    attributes: ['role', 'chefEquipe'], // Select specific fields
                    include: [
                        {
                            model: Utilisateur,
                            as: 'utilisateur',
                            attributes: ['id', 'nom', 'prenom'] // Select specific fields
                        }
                    ]
                }
            ],
        });

        if (!projet) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Format the response to include team members with their details
        const response = {
            ...projet.toJSON(),
            membres: projet.membresEquipe ? projet.membresEquipe.map(member => ({
                utilisateurId: member.utilisateurId,
                role: member.role,
                utilisateur: member.utilisateur // This will only include id, nom, and prenom
            })) : [] // Fallback to empty array if `membresEquipe` is undefined
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'An error occurred while fetching the project' });
    }
};


// Get all projects
exports.getAllProjets = async (req, res) => {
    try {
        const projets = await Projet.findAll({
            include: [
                { model: Utilisateur, as: 'client' },
                { model: Utilisateur, as: 'chefProjet' },
            ],
        });

        res.status(200).json(projets);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
    }
};


exports.updateProjet = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, clientId, chefProjetId, dateDebut, dateFin, statut, budget, priorite, livrables, risques, jalons, membresEquipe } = req.body;

        // Fetch the project to check if it exists
        const projet = await Projet.findByPk(id);

        if (!projet) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Update the project details
        await projet.update({
            nom,
            description,
            clientId,
            chefProjetId,
            dateDebut,
            dateFin,
            statut,
            budget,
            priorite,
            livrables,
            risques,
            jalons,
        });

        // Fetch current team members for the project
        const currentMembers = await MembreEquipe.findAll({ where: { projetId: id } });

        // Extract the IDs of current members
        const currentMemberIds = currentMembers.map(member => member.utilisateurId);


        // Extract the IDs of new members
        const newMembers = membresEquipe.map(member => ({
            utilisateurId: member.utilisateur.id,
            role: member.role,
            chefEquipe: member.chefEquipe // Add this line if `chefEquipeId` is included
        }));


        // Remove members who are no longer associated
        const membersToRemove = currentMembers.filter(member => !newMembers.some(newMember => newMember.utilisateurId === member.utilisateurId));
        if (membersToRemove.length > 0) {
            await MembreEquipe.destroy({ where: { id: membersToRemove.map(member => member.id) } });
        }

        // Add or update new members
        for (const member of newMembers) {
            console.log('Processing new member:', member); // Log the member being processed

            const existingMember = currentMembers.find(m => m.utilisateurId === member.utilisateurId);
            if (existingMember) {
                // If the member already exists, update it
                await existingMember.update({
                    role: member.role,
                    chefEquipe: member.chefEquipe
                });
            } else {
                // If the member is new, create it
                await MembreEquipe.create({
                    projetId: id,
                    utilisateurId: member.utilisateurId,
                    role: member.role,
                    chefEquipeId: member.chefEquipeId
                });
            }
        }

        res.status(200).json(projet);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'An error occurred while updating the project' });
    }
};



// Delete a project by ID
exports.deleteProjet = async (req, res) => {
    try {
        const { id } = req.params;

        const projet = await Projet.findByPk(id);

        if (!projet) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await projet.destroy();

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'An error occurred while deleting the project' });
    }
};

// Create a new user story
exports.createUserStory = async (req, res) => {
    try {
        const { projetId, titre, description, priorite, statut } = req.body;
        const newUserStory = await UserStory.create({ projetId, titre, description, priorite, statut });
        res.status(201).json(newUserStory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserStoriesByProjectId = async (req, res) => {
    try {
        const { projetId } = req.params;
        const userStories = await UserStory.findAll({ where: { projetId: projetId } });
        res.json(userStories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserStoryById = async (req, res) => {
    try {
        const userStory = await UserStory.findByPk(req.params.id);
        if (userStory) {
            res.json(userStory);
        } else {
            res.status(404).json({ message: 'User Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserStory = async (req, res) => {
    try {
        const { titre, description, priorite, statut } = req.body;
        const userStory = await UserStory.findByPk(req.params.id);
        if (userStory) {
            await userStory.update({ titre, description, priorite, statut });
            res.json(userStory);
        } else {
            res.status(404).json({ message: 'User Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserStory = async (req, res) => {
    try {
        const userStory = await UserStory.findByPk(req.params.id);
        if (userStory) {
            await userStory.destroy();
            res.json({ message: 'User Story deleted successfully' });
        } else {
            res.status(404).json({ message: 'User Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};