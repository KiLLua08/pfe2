const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Assuming 'Utilisateur' and 'Package' models are properly defined
const DemandeClient = sequelize.define('DemandeClient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    packageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Packages',
            key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    },
    sujetSite: {
        type: DataTypes.JSON, // Using JSON to store multiple values
        allowNull: false,
    },
    objectifsPrincipaux: {
        type: DataTypes.JSON, // Using JSON to store multiple values
        allowNull: false,
    },
    typesPages: {
        type: DataTypes.JSON, // Using JSON to store multiple values
        allowNull: false,
    },
    logoIdentiteVisuelle: {
        type: DataTypes.BOOLEAN, // Boolean type for Yes/No
        allowNull: false,
    },
    referencesSites: {
        type: DataTypes.JSON, // Using JSON to store multiple values
    },
    delaisRealisation: {
        type: DataTypes.STRING, // Single value
        allowNull: false,
    },
    fonctionnalitesSpecifiques: {
        type: DataTypes.JSON, // Using JSON to store multiple values
        allowNull: false,
    },
    nomDomaineHebergement: {
        type: DataTypes.BOOLEAN, // Boolean type for Yes/No
        allowNull: false,
    },
    styleVisuel: {
        type: DataTypes.JSON, // Using JSON to store multiple values
        allowNull: false,
    },
    concurrents: {
        type: DataTypes.JSON, // Using JSON to store multiple values
    },
    etat: {
        type: DataTypes.ENUM,
        values: ['En attente traitement', 'En cours', 'Traité', 'Annulé'],
        defaultValue: 'en attente traitement' // Optional: Set a default value
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});

module.exports = DemandeClient;
