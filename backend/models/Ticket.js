const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('Bug', 'Demande de Fonctionnalité', 'Amélioration', 'Performance', 'Maintenance'),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type:DataTypes.ENUM('Nouveau', 'En Cours', 'En Attente', 'Résolu', 'Fermé'),
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('Critique', 'Élevée', 'Moyenne', 'Basse'),
        allowNull: false,
    },
    clientId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
    },
    assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Utilisateurs',
            key: 'id',
        },
        
    },
}, {
    timestamps: true,
});



module.exports = Ticket;
