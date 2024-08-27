const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tache = require('./Tache'); // Assuming your Tache model is named Tache
const Utilisateur = require('./Utilisateur'); // Assuming your User model is named Utilisateur

const TacheSubscriber = sequelize.define('TacheSubscriber', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tacheId: {
        type: DataTypes.INTEGER,
        references: {
            model: Tache,
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

module.exports = TacheSubscriber;
