const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');

const Projet = sequelize.define('Projet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: 'id',
    },
    allowNull: false,
  },
  chefProjetId: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: 'id',
    },
    allowNull: false,
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
    defaultValue: 'non démarré',
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  priorite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  livrables: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  risques: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  jalons: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Projet;
