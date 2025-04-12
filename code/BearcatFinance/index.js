const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// require('./cron/dailySnapshot');  -- uncomment later

const app = express();
const port = 3002;
// const redis = require('./redis/redisClient');
// const { redisPublisher } = require('./redis/redisClient')
// require('./redis/subcriber/redisSubscriber');

// uncomment to connect to amazon database
// const sequelize = new Sequelize('bearcat_finance_app', 'admin', 'Gdpteam3', {
//   host: 'database-1.cbm6q2wayzrp.us-east-2.rds.amazonaws.com',
//   dialect: 'mysql',
//   port: 3306, 
// });

//connection for local database
const sequelize = new Sequelize('bearcat_finance_app', 'root', 'Gdpteam3', {
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

const Category = require('./models/categories')(sequelize, DataTypes);
const User = require('./models/users')(sequelize, DataTypes);
const UserBankAccounts = require('./models/userBankAccounts')(sequelize, DataTypes);
const SavingGoals = require('./models/savingGoals')(sequelize, DataTypes);
const Expenses = require('./models/expenses')(sequelize, DataTypes);
const Budgets = require('./models/budgets')(sequelize, DataTypes);
const BankDetails = require('./models/bankDetails')(sequelize, DataTypes);


sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

const userRoutes = require('./routes/userRoutes')(sequelize);
const userBankAccountRoutes = require('./routes/userBankAccountRoutes')(sequelize);
const savingGoalRoutes = require('./routes/savingGoalsRoutes')(sequelize);
const expenseRoutes = require('./routes/expenseRoutes')(sequelize);
const categoryRoutes = require('./routes/categoryRoutes')(sequelize);
const budgetRoutes = require('./routes/budgetRoutes')(sequelize);
const bankDetailRoutes = require('./routes/bankDetailsRoutes')(sequelize);
const statisticsRoutes = require('./routes/statisticsRoutes')(sequelize);


app.use(express.json());

app.use('/user', userRoutes);
app.use('/userBankAccount', userBankAccountRoutes);
app.use('/savingGoal', savingGoalRoutes);
app.use('/expense', expenseRoutes);
app.use('/category', categoryRoutes);
app.use('/budget', budgetRoutes);
app.use('/bankDetails', bankDetailRoutes);
app.use('/financial',statisticsRoutes);

// app.use('/test', (req, res) => {
//   console.log("Test route hit 11111111111111111111111",req.query);
//   msgId = req.query.msgId;
//   console.log("param::::::::::::::::::::::::::::::::::::",msgId);
//   redisPublisher.publish('transactions.sync', JSON.stringify(msgId));
//   res.send('Hello World!');
// });

app.get('/test1', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://192.168.1.11:${port}`);
});
