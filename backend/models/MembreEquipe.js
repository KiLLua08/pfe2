const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Projet = require('./Projet');

const MembreEquipe = sequelize.define('MembreEquipe', {
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
    utilisateurId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chefEquipe: {
        type: DataTypes.BOOLEAN,
        allowNull: true, // Keep this if the field can be null, otherwise set to false
    }
});

module.exports = MembreEquipe;
