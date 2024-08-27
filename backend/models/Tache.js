const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Projet = require('./Projet');
const UserStory = require('./UserStory');
const Tache = sequelize.define('Tache', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projetId: {
        type: DataTypes.INTEGER,
        references: {
            model: Projet,
            key: 'id',
        },
        allowNull: false,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    assigneeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
        allowNull: true,
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'non démarré',
    },
    priorite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateEcheance: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    userStoryId: { // Add foreign key for UserStory association
        type: DataTypes.INTEGER,
        references: {
            model: UserStory,
            key: 'id',
        },
        allowNull: true,
    },
});

module.exports = Tache;
