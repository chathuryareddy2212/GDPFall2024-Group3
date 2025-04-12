const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  const budgetsController = require('../controllers/budgetController')(sequelize);

  const {
    getBudgetsForUser,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget
  } = budgetsController;

  router.get('/user/:userId/budgets', verifyToken, getBudgetsForUser);
  router.get('/budgets/:budgetId', verifyToken, getBudgetById);
  router.post('/budgets', verifyToken, createBudget);
  router.put('/budgets/:budgetId', verifyToken, updateBudget);
  router.delete('/budgets/:budgetId', verifyToken, deleteBudget);

  return router;
};
