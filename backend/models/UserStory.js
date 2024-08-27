const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Projet = require('./Projet');
const Sprint = require('./Sprint');

const UserStory = sequelize.define('UserStory', {
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
    sprintId: {
        type: DataTypes.INTEGER,
        references: {
            model: Sprint,
            key: 'id',
        },
        allowNull: true, // or false depending on your requirement
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    priorite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'non démarré',
    },
});

module.exports = UserStory;
