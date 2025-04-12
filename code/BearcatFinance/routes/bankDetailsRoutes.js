const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const bankDetailsController = require('../controllers/bankDetailsController')(sequelize);

  router.get('/', bankDetailsController.getAllBanksDetails);
  router.get('/:bankId', bankDetailsController.getBankDetailsById);
  router.post('/', bankDetailsController.addBankDetails);
  router.put('/:bankId', bankDetailsController.updateBankDetails);
  router.delete('/:bankId', bankDetailsController.deleteBankDetails);

  return router;
};
