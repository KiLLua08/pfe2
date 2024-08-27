const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur'); // Adjust the path as needed

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    creatorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
        allowNull: false,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = Chat;
