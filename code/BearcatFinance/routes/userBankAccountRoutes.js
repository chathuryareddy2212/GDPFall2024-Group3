const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  const userBankAccountController = require('../controllers/userBankAccountController')(sequelize);

  router.get('/', verifyToken, userBankAccountController.getAllUserAccounts);
  router.post('/', userBankAccountController.addAccount);
  router.put('/:accountId', userBankAccountController.updateAccount);
  router.delete('/:accountId', userBankAccountController.deleteAccount);

  return router;
};
