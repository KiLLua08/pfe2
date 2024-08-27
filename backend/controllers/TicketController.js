const { Ticket, Utilisateur, Log } = require('../models');
const TicketAttachment = require('../models/TicketAttachment');
// Get all tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            include: [
                { model: Utilisateur, as: 'client' },
                { model: Utilisateur, as: 'assignedUser' },
                { model: TicketAttachment, as: 'attachments' },
                { model: Log, as: 'Logs', order: [['createdAt', 'DESC']] },
                { model: Utilisateur, through: 'TicketSubscriber', as: 'subscribers' },
            ], order: [
                ['id', 'DESC'] // Order by createdAt field in descending order
            ]
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






exports.getAllTicketsbyClient = async (req, res) => {
    const { clientId } = req.body; // Get clientId from request body

    if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    try {
        const tickets = await Ticket.findAll({
            where: {
                clientId: clientId // Filter tickets by clientId
            },
            include: [
                { model: Utilisateur, as: 'client' },
                { model: Utilisateur, as: 'assignedUser' },
                { model: TicketAttachment, as: 'attachments' },
                { model: Log, as: 'Logs', order: [['createdAt', 'DESC']] },
                { model: Utilisateur, through: 'TicketSubscriber', as: 'subscribers' },
            ],
            order: [
                ['id', 'DESC'] // Order by id field in descending order
            ]
        });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id, {
            include: [
                { model: Utilisateur, attributes: ['id', 'nom', 'prenom', 'img'], as: 'client' },
                { model: Utilisateur, attributes: ['id', 'nom', 'prenom', 'img'], as: 'assignedUser' },
                { model: TicketAttachment, as: 'attachments' },
                {
                    model: Log, as: 'Logs', order: [['createdAt', 'DESC']], include: {
                        model: Utilisateur,

                        attributes: ['nom', 'prenom', 'img'] // Spécifiez les champs que vous souhaitez récupérer pour les utilisateurs dans les logs
                    }
                },
                { model: Utilisateur, through: 'TicketSubscriber', attributes: ['id', 'nom', 'prenom', 'img'], as: 'subscribers' },
            ],
        });
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { subject, category, description, priority, clientId, status, assignedUserId } = req.body;
        const ticketData = {
            subject,
            category,
            description,
            priority,
            clientId,
            status,
        };
        if (Number.isInteger(assignedUserId)) {
            ticketData.assignedUserId = assignedUserId;
        }
        const ticket = await Ticket.create(ticketData);

        const attachments = req.files.map(file => ({
            filename: file.filename,
            ticketId: ticket.id,
        }));
        await TicketAttachment.bulkCreate(attachments);

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a ticket
exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (ticket) {
            await ticket.update(req.body);
            res.json(ticket);
        } else {
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a ticket
exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);
        if (ticket) {
            await ticket.destroy();
            res.json({ message: 'Ticket deleted' });
        } else {
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add an attachment to a ticket
exports.addAttachment = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket introuvable' });
        }



        const attachments = req.files.map(file => ({
            filename: file.filename,
            ticketId: ticket.id,
        }));

        await TicketAttachment.bulkCreate(attachments);

        res.status(201).json({ message: 'Attachments added successfully', attachments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an attachment from a ticket
exports.deleteAttachment = async (req, res) => {
    try {
        const attachment = await TicketAttachment.findByPk(req.params.attachmentId);
        if (attachment) {
            await attachment.destroy();
            res.json({ message: 'Attachment supprimer' });
        } else {
            res.status(404).json({ error: 'Attachment introuvable' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a subscriber to a ticket
exports.addSubscriber = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        const user = await Utilisateur.findByPk(req.body.userId);
        if (ticket && user) {
            await ticket.addSubscriber(user);
            res.status(201).json({ message: 'Subscriber added' });
        } else {
            res.status(404).json({ error: 'Ticket or User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove a subscriber from a ticket
exports.removeSubscriber = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        const user = await Utilisateur.findByPk(req.params.userId);
        if (ticket && user) {
            await ticket.removeSubscriber(user);
            res.json({ message: 'Subscriber removed' });
        } else {
            res.status(404).json({ error: 'Ticket or User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Add a log to a ticket
exports.addLog = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        if (ticket) {
            const log = await Log.create({
                ticketId: req.params.ticketId,
                content: req.body.content,
                userId: req.body.userId,
            });
            res.status(201).json(log);
        } else {
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get logs for a ticket
exports.getLogsByTicketId = async (req, res) => {
    try {
        const logs = await Log.findAll({
            where: { ticketId: req.params.ticketId },
            include: {
                model: Utilisateur, as: 'Utilisateur',
                attributes: ['nom', 'img']
            },
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a log from a ticket
exports.deleteLog = async (req, res) => {
    try {
        const log = await Log.findByPk(req.params.logId);
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
        const log = await Log.findByPk(req.params.logId);
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


exports.getClientsFromTickets = async (req, res) => {
    try {
        // Step 1: Get unique clientId values from Ticket
        const tickets = await Ticket.findAll({
            attributes: ['clientId'],
            group: ['clientId'], // Ensure distinct clientIds
        });

        // Extract clientIds from the query result
        const clientIds = tickets.map(ticket => ticket.clientId);

        if (clientIds.length === 0) {
            return res.json([]); // Return empty array if no clientIds found
        }

        // Step 2: Fetch users with the retrieved clientIds
        const clients = await Utilisateur.findAll({
            attributes: ['id', 'nom', 'prenom'],
            where: {
                id: clientIds,
            },
        });

        // Step 3: Send response
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients from tickets:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getAssignedUsersFromTickets = async (req, res) => {
    try {
        // Get all unique assignedUserId values from Ticket
        const tickets = await Ticket.findAll({
            attributes: ['assignedUserId'],
            group: ['assignedUserId'],
        });

        // Extract assignedUserIds from the query result
        const assignedUserIds = tickets.map(ticket => ticket.assignedUserId).filter(id => id !== null);

        if (assignedUserIds.length === 0) {
            return res.json([]);
        }

        // Fetch Utilisateur details based on the extracted assignedUserIds
        const assignedUsers = await Utilisateur.findAll({
            attributes: ['id', 'nom', 'prenom'],
            where: {
                id: assignedUserIds,
            },
        });

        res.json(assignedUsers);
    } catch (error) {
        console.error('Error fetching assigned users from tickets:', error.message);
        res.status(500).json({ error: error.message });
    }
};


