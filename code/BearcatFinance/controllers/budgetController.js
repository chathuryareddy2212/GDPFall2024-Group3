module.exports = (sequelize) => {
  const Budgets = require('../models/budgets')(sequelize);
  const Expenses = require('../models/expenses')(sequelize);

  const getBudgetsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const budgets = await Budgets.findAll({ where: { UserID: userId } });

      const budgetsWithCurrentAmount = await Promise.all(
        budgets.map(async (budget) => {
          const totalExpenses = await Expenses.sum('Amount', { where: { BudgetID: budget.BudgetID } });
          return {
            ...budget.toJSON(),
            AmountSpent: totalExpenses != null
              ? Number(totalExpenses) + Number(budget.AmountSpent)
              : Number(budget.AmountSpent),
          };
        })
      );

      return res.status(200).json(budgetsWithCurrentAmount);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      return res.status(500).json({ error: 'Failed to fetch budgets for the user.' });
    }
  };

  const getBudgetById = async (req, res) => {
    const { budgetId } = req.params;

    try {
      const budget = await Budgets.findByPk(budgetId);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found.' });
      }

      return res.status(200).json(budget);
    } catch (err) {
      console.error('Error fetching budget details:', err);
      return res.status(500).json({ error: 'Failed to fetch budget details.' });
    }
  };

  const createBudget = async (req, res) => {
    const { BudgetName, UserID, Amount, StartDate, EndDate, AmountSpent } = req.body;

    try {
      const newBudget = await Budgets.create({
        BudgetName,
        UserID,
        Amount,
        AmountSpent,
        StartDate,
        EndDate,
      });

      return res.status(201).json({
        message: 'Budget created successfully.',
        budget: newBudget,
      });
    } catch (err) {
      console.error('Error creating budget:', err);
      return res.status(500).json({ error: 'Failed to create budget.' });
    }
  };

  const updateBudget = async (req, res) => {
    const { budgetId } = req.params;
    const { BudgetName, Amount, AmountSpent, StartDate, EndDate } = req.body;

    try {
      const budget = await Budgets.findByPk(budgetId);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found.' });
      }

      await budget.update({ BudgetName, Amount, AmountSpent, StartDate, EndDate });

      return res.status(200).json({
        message: 'Budget updated successfully.',
        budget,
      });
    } catch (err) {
      console.error('Error updating budget:', err);
      return res.status(500).json({ error: 'Failed to update budget.' });
    }
  };

  const deleteBudget = async (req, res) => {
    const { budgetId } = req.params;

    try {
      const budget = await Budgets.findByPk(budgetId);
      if (!budget) {
        return res.status(404).json({ message: 'Budget not found.' });
      }

      await budget.destroy();

      return res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (err) {
      console.error('Error deleting budget:', err);
      return res.status(500).json({ error: 'Failed to delete budget.' });
    }
  };

  return {
    getBudgetsForUser,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
  };
};
