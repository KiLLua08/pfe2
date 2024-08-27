const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Utilisateur = sequelize.define('Utilisateur', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    mdp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('client', 'admin', 'project_manager', 'front_developer', 'back_developer', 'fullstack_developer', 'designer', 'qa_tester', 'devops', 'support'),
        allowNull: false,
    },
    expertise: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
    },
    emailConfirmationToken: {
        type: DataTypes.STRING,
    },
    emailConfirmationExpires: {
        type: DataTypes.DATE,
    },
    emailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    etat: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.mdp = await bcrypt.hash(user.mdp, salt);
        },
    }
});

module.exports = Utilisateur;
