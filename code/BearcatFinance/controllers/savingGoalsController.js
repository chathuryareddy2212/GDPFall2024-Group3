const axios = require('axios');

module.exports = (sequelize) => {
  const SavingGoals = require('../models/savingGoals')(sequelize);
  const Expenses = require('../models/expenses')(sequelize);

  const getSavingGoalsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const goals = await SavingGoals.findAll({ where: { UserID: userId } });

      const goalsWithCurrentAmount = await Promise.all(
        goals.map(async (goal) => {
          const totalExpenses = await Expenses.sum('Amount', { where: { GoalID: goal.GoalID } });
          return {
            ...goal.toJSON(),
            CurrentAmount: totalExpenses != null
              ? Number(totalExpenses) + Number(goal.CurrentAmount)
              : Number(goal.CurrentAmount),
          };
        })
      );

      return res.status(200).json(goalsWithCurrentAmount);
    } catch (err) {
      console.error('Error fetching saving goals:', err);
      return res.status(500).json({ error: 'Failed to fetch saving goals for the user.' });
    }
  };

  const getSavingGoalById = async (req, res) => {
    const { goalId } = req.params;

    try {
      const goal = await SavingGoals.findByPk(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Saving goal not found.' });
      }

      return res.status(200).json(goal);
    } catch (err) {
      console.error('Error fetching saving goal details:', err);
      return res.status(500).json({ error: 'Failed to fetch saving goal details.' });
    }
  };

  const addSavingGoal = async (req, res) => {
    const { UserID, GoalName, TargetAmount, CurrentAmount, Deadline } = req.body;

    try {
      const newGoal = await SavingGoals.create({
        UserID,
        GoalName,
        TargetAmount,
        CurrentAmount,
        Deadline,
      });

      return res.status(201).json({
        message: 'Saving goal added successfully.',
        goal: newGoal,
      });
    } catch (err) {
      console.error('Error adding saving goal:', err);
      return res.status(500).json({ error: 'Failed to add saving goal.' });
    }
  };

  const updateSavingGoal = async (req, res) => {
    const { goalId } = req.params;
    const { GoalName, TargetAmount, CurrentAmount, Deadline } = req.body;

    try {
      const goal = await SavingGoals.findByPk(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Saving goal not found.' });
      }

      await goal.update({
        GoalName,
        TargetAmount,
        CurrentAmount,
        Deadline,
      });

      return res.status(200).json({
        message: 'Saving goal updated successfully.',
        goal,
      });
    } catch (err) {
      console.error('Error updating saving goal:', err);
      return res.status(500).json({ error: 'Failed to update saving goal.' });
    }
  };

  const deleteSavingGoal = async (req, res) => {
    const { goalId } = req.params;

    try {
      const goal = await SavingGoals.findByPk(goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Saving goal not found.' });
      }

      await goal.destroy();

      return res.status(200).json({ message: 'Saving goal deleted successfully.' });
    } catch (err) {
      console.error('Error deleting saving goal:', err);
      return res.status(500).json({ error: 'Failed to delete saving goal.' });
    }
  };

  return {
    getSavingGoalsForUser,
    getSavingGoalById,
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
  };
};
