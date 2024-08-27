const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ticketId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tickets',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

module.exports = Log;
