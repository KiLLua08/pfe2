const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Chat = require('./Chat');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chatId: {
        type: DataTypes.INTEGER,
        references: {
            model: Chat,
            key: 'id',
        },
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id',
        },
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true,
    }, seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
});


module.exports = Message;
