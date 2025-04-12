const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  const expensesController = require('../controllers/expenseController')(sequelize);

  const { 
    getExpensesForUser,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    syncTransactions
  } = expensesController;

  router.get('/expenses/user/:userId', verifyToken, getExpensesForUser);
  router.get('/expenses/:expenseId', verifyToken, getExpenseById);
  router.post('/create/expenses', verifyToken, addExpense);
  router.put('/expenses/:expenseId', verifyToken, updateExpense);
  router.delete('/expenses/:expenseId', verifyToken, deleteExpense);
  router.get('/sync-transactions/:userId', verifyToken, syncTransactions);

  return router;
};
