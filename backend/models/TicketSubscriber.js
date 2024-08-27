const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Ticket = require('./Ticket'); // Assuming your Ticket model is named Ticket
const Utilisateur = require('./Utilisateur'); // Assuming your User model is named Utilisateur

const TicketSubscriber = sequelize.define('TicketSubscriber', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ticketId: {
        type: DataTypes.INTEGER,
        references: {
            model: Ticket,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
    },
});

module.exports = TicketSubscriber;
