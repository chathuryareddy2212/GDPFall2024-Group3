const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bearcat_finance_app', 'admin', 'Gdpteam3', {
  host: 'database-1.cbm6q2wayzrp.us-east-2.rds.amazonaws.com',
  dialect: 'mysql',
});

module.exports = sequelize;