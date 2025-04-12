const express = require('express')
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
    const statisticsController=require('../controllers/statisticsController')(sequelize);


    router.get('/user/:userId',statisticsController.getExpensesForUser);

    router.get('/user/budgets/:userId',statisticsController.getBudgetsReportsForUser);

    router.get('/user/savinggoal/:userId',statisticsController.getSavingGoalsReportsForUser);

    return router;
}

