const express = require('express');
const router = express.Router();
const verifyTokenWithUserID = require('../jwt/verify');

module.exports = (sequelize) => {
  const bankController = require('../controllers/bankController')(sequelize); 
  const { createBankAccount, addTransaction, getAllTransactions } = bankController;

  router.post('/createAccount', createBankAccount);

  router.post('/addTransaction',addTransaction);

  router.get('/transactions/:AccountNumber/offset/:offset' , getAllTransactions);

  return router;
};  
