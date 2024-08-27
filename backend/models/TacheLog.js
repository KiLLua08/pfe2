const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tache = require('./Tache'); // Assuming your Tache model is named Tache
const Utilisateur = require('./Utilisateur'); // Assuming your Utilisateur model is named Utilisateur

const TacheLog = sequelize.define('TacheLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tacheId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tache,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = TacheLog;
