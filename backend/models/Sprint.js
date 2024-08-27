const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Projet = require('./Projet');

const Sprint = sequelize.define('Sprint', {
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
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Non démarré',
    },
    priorite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Sprint;
