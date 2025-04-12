const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');

module.exports = (sequelize) => {
  const savingGoalsController = require('../controllers/savingGoalsController')(sequelize);

  const {
    getSavingGoalsForUser,
    getSavingGoalById,
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoal
  } = savingGoalsController;

  router.get('/user/:userId', verifyToken, getSavingGoalsForUser);
  router.get('/goal/:goalId', verifyToken, getSavingGoalById);
  router.post('/', verifyToken, addSavingGoal);
  router.put('/:goalId', verifyToken, updateSavingGoal);
  router.delete('/:goalId', verifyToken, deleteSavingGoal);

  return router;
};
