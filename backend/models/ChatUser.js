const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur'); // Adjust the path as needed
const Chat = require('./Chat');

const ChatUser = sequelize.define('ChatUser', {
    chatId: {
        type: DataTypes.INTEGER,
        references: {
            model: Chat,
            key: 'id',
        },
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
        primaryKey: true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = ChatUser;
