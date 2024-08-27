const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Ticket = require('./Ticket'); // Assuming your Ticket model is named Ticket

const TicketAttachment = sequelize.define('TicketAttachment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Add other fields as needed, such as URL, size, etc.
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ticket,
            key: 'id',
        },
    },
});

module.exports = TicketAttachment;
