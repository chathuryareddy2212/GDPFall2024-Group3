const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('otp_db', 'root', 'Gdpteam3', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: false,
// });


const sequelize = new Sequelize('otp_db', 'admin', 'Gdpteam3', {
  host: 'database-1.cbm6q2wayzrp.us-east-2.rds.amazonaws.com',
  dialect: 'mysql',
  logging: false,
});
module.exports = sequelize;
