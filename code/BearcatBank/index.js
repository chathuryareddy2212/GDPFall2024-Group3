const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3001;

// uncomment to connect to amazon database
// const sequelize = new Sequelize('bearcat_bank', 'admin', 'Gdpteam3', {
//   host: 'database-1.cbm6q2wayzrp.us-east-2.rds.amazonaws.com',
//   dialect: 'mysql',
//   port: 3306, 
// });


const sequelize = new Sequelize('bearcat_bank', 'root', 'Gdpteam3', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, 
  });


sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = require('./models/user')(sequelize, DataTypes);  
const BankAccountDetails = require('./models/bankAccount')(sequelize, DataTypes);
const Transactions = require('./models/transaction')(sequelize, DataTypes);

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

const userRoutes = require('./routes/userRoutes')(sequelize);
const bankRoutes = require('./routes/bankRoutes')(sequelize);

app.use(express.json());
app.use('/user', userRoutes);
app.use('/bank', bankRoutes);

app.use('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/test1', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://192.168.1.11:${port}`);
});
