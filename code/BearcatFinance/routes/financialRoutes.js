const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  const financialReportsController = require('../controllers/financialReportsController')(sequelize);

  const {
    getFinancialReportsForUser,
    getFinancialReportById,
    generateFinancialReport,
    updateFinancialReport,
    deleteFinancialReport
  } = financialReportsController;

  router.get('/user/:userId', verifyToken, getFinancialReportsForUser);
  router.get('/:reportId', verifyToken, getFinancialReportById);
  router.post('/', verifyToken, generateFinancialReport);
  router.put('/:reportId', verifyToken, updateFinancialReport);
  router.delete('/:reportId', verifyToken, deleteFinancialReport);

  return router;
};
