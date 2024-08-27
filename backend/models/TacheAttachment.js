const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tache = require('./Tache'); // Assuming your Tache model is named Tache

const TacheAttachment = sequelize.define('TacheAttachment', {
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
    tacheId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tache,
            key: 'id',
        },
    },
});

module.exports = TacheAttachment;
