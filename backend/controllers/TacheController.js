const { Tache, Utilisateur, UserStory } = require('../models');
const TacheLog = require('../models/TacheLog');
const TacheAttachment = require('../models/TacheAttachment');

// Get all tasks
exports.getAllTaches = async (req, res) => {
    try {
        const taches = await Tache.findAll({
            include: [
                { model: UserStory, as: 'userStory' },
                { model: TacheAttachment, as: 'attachments' },
                {
                    model: TacheLog,
                    as: 'logs',
                    include: [{ model: Utilisateur, as: 'user' }], // Correct alias for Utilisateur in TacheLog
                    order: [['createdAt', 'DESC']]
                },
                { model: Utilisateur, as: 'assignee' },
                { model: Utilisateur, as: 'subscribers' }
            ],
            order: [['id', 'DESC']]
        });
        res.json(taches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get task by ID
exports.getTacheById = async (req, res) => {
    try {
        const tache = await Tache.findByPk(req.params.id, {
            include: [
                { model: UserStory, as: 'userStory' },
                { model: Utilisateur, as: 'assignee', attributes: ['id', 'nom', 'prenom', 'img'] },
                { model: TacheAttachment, as: 'attachments' },
                {
                    model: TacheLog,
                    as: 'logs',
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: Utilisateur, as: 'user', attributes: ['nom', 'prenom', 'img'] } // Correct alias for Utilisateur in TacheLog
                    ]
                },
            ],
        });
        if (tache) {
            res.json(tache);
        } else {
            res.status(404).json({ error: 'Tache not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new task
exports.createTache = async (req, res) => {
    try {
        const { nom, description, priorite, projetId, assigneeId, statut } = req.body;
        const tache = await Tache.create({
            nom,
            description,
            priorite,
            projetId,
            assigneeId,
            statut,
        });

        const attachments = req.files.map(file => ({
            filename: file.filename,
            tacheId: tache.id,
        }));
        await TacheAttachment.bulkCreate(attachments);

        res.status(201).json(tache);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a task
exports.updateTache = async (req, res) => {
    try {
        const tache = await Tache.findByPk(req.params.id);
        if (tache) {
            await tache.update(req.body);
            res.json(tache);
        } else {
            res.status(404).json({ error: 'Tache not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a task
exports.deleteTache = async (req, res) => {
    try {
        const tache = await Tache.findByPk(req.params.id);
        if (tache) {
            await tache.destroy();
            res.json({ message: 'Tache deleted' });
        } else {
            res.status(404).json({ error: 'Tache not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add an attachment to a task
exports.addAttachment = async (req, res) => {
    try {
        const tache = await Tache.findByPk(req.params.tacheId);
        if (!tache) {
            return res.status(404).json({ error: 'Tache not found' });
        }

        const attachments = req.files.map(file => ({
            filename: file.filename,
            tacheId: tache.id,
        }));

        await TacheAttachment.bulkCreate(attachments);

        res.status(201).json({ message: 'Attachments added successfully', attachments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an attachment from a task
exports.deleteAttachment = async (req, res) => {
    try {
        const attachment = await TacheAttachment.findByPk(req.params.attachmentId);
        if (attachment) {
            await attachment.destroy();
            res.json({ message: 'Attachment deleted' });
        } else {
            res.status(404).json({ error: 'Attachment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a log to a task
exports.addLog = async (req, res) => {
    try {
        const tache = await Tache.findByPk(req.params.tacheId);
        if (tache) {
            const log = await TacheLog.create({
                tacheId: req.params.tacheId,
                description: req.body.description,
                userId: req.body.userId,
            });
            res.status(201).json(log);
        } else {
            res.status(404).json({ error: 'Tache not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get logs for a task
exports.getLogsByTacheId = async (req, res) => {
    try {
        const logs = await TacheLog.findAll({
            where: { tacheId: req.params.tacheId },
            include: { model: Utilisateur, as: 'user', attributes: ['nom', 'img'] } // Correct alias for Utilisateur in TacheLog
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a log from a task
exports.deleteLog = async (req, res) => {
    try {
        const log = await TacheLog.findByPk(req.params.logId);
        if (log) {
            await log.destroy();
            res.json({ message: 'Log deleted' });
        } else {
            res.status(404).json({ error: 'Log not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a log
exports.updateLog = async (req, res) => {
    try {
        const log = await TacheLog.findByPk(req.params.logId);
        if (log) {
            await log.update(req.body);
            res.json(log);
        } else {
            res.status(404).json({ error: 'Log not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
