const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pfe1.0', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false, // Disable logging if you prefer
});

module.exports = sequelize;