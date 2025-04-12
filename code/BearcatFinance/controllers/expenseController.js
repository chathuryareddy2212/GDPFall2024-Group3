const axios = require('axios');
const redis = require('../redis/redisClient');

module.exports = (sequelize) => {
  const Categories = require('../models/categories')(sequelize);
  const Expenses = require('../models/expenses')(sequelize);
  const UserBankAccounts = require('../models/userBankAccounts')(sequelize);

  const getExpensesForUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const expenses = await Expenses.findAll({
        where: { UserID: userId },
        attributes: ['ExpenseID', 'CategoryID', 'TransactionType', 'Amount', 'Description', 'GoalID', 'BudgetID', 'Merchandise', 'Date', 'createdAt', 'updatedAt'],
        order: [['Date', 'DESC']],
      });

      if (expenses.length === 0) {
        return res.status(404).json({ message: 'No expenses found for this user.' });
      }

      const categoryIds = [...new Set(expenses.map(expense => expense.CategoryID))];

      const categories = await Categories.findAll({
        where: { id: categoryIds },
        attributes: ['id', 'name'],
      });

      const categoryMap = categories.reduce((map, category) => {
        map[category.id] = category.name;
        return map;
      }, {});

      const categorizedExpenses = {};

      for (const expense of expenses) {
        const categoryId = expense.CategoryID;
        const categoryName = categoryMap[categoryId] || 'Unknown';
        const transactionType = expense.TransactionType;
        const amount = parseFloat(expense.Amount);

        if (!categorizedExpenses[categoryId]) {
          categorizedExpenses[categoryId] = {
            categoryName,
            debitTotal: 0,
            creditTotal: 0,
            expenses: [],
          };
        }

        if (transactionType && (transactionType.toLowerCase() === 'debit' || transactionType.toLowerCase() === 'withdrawal')) {
          categorizedExpenses[categoryId].debitTotal += amount;
        } else if (transactionType && (transactionType.toLowerCase() === 'credit' || transactionType.toLowerCase() === 'deposit')) {
          categorizedExpenses[categoryId].creditTotal += amount;
        }

        categorizedExpenses[categoryId].expenses.push({
          ExpenseID: expense.ExpenseID,
          CategoryID: categoryId,
          CategoryName: categoryName,
          Amount: expense.Amount,
          Description: expense.Description,
          GoalID: expense.GoalID,
          BudgetID: expense.BudgetID,
          TransactionType: transactionType,
          Merchandise: expense.Merchandise,
          Date: expense.Date,
          createdAt: expense.createdAt,
          updatedAt: expense.updatedAt,
        });
      }

      const categorizedExpensesArray = Object.keys(categorizedExpenses).map((categoryId) => {
        const category = categorizedExpenses[categoryId];
        return {
          categoryName: category.categoryName,
          debitTotal: category.debitTotal.toFixed(2),
          creditTotal: category.creditTotal.toFixed(2),
          expenses: category.expenses,
        };
      });

      return res.status(200).json({
        categorizedExpenses: categorizedExpensesArray,
      });

    } catch (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Failed to fetch expenses for the user.' });
    }
  };

  const getExpenseById = async (req, res) => {
    const { expenseId } = req.params;

    try {
      const expense = await Expenses.findByPk(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
      }

      return res.status(200).json(expense);
    } catch (err) {
      console.error('Error fetching expense details:', err);
      return res.status(500).json({ error: 'Failed to fetch expense details.' });
    }
  };

  const addExpense = async (req, res) => {
    try {
      const expenseData = req.body;
      expenseData.UserID = req.user.userId;
      const newExpense = await Expenses.create(expenseData);
      return res.json({ success: true, data: newExpense });
    } catch (err) {
      console.error('Error adding expense:', err);
      return res.json({ success: false, error: 'Failed to add expense. Please try again.' });
    }
  };

  const updateExpense = async (req, res) => {
    const { expenseId } = req.params;

    try {
      const expense = await Expenses.findByPk(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
      }

      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== undefined)
      );

      await expense.update(updateData);

      return res.status(200).json({
        message: 'Expense updated successfully.',
        expense,
      });
    } catch (err) {
      console.error('Error updating expense:', err);
      return res.status(500).json({ error: 'Failed to update expense.' });
    }
  };

  const deleteExpense = async (req, res) => {
    const { expenseId } = req.params;

    try {
      const expense = await Expenses.findByPk(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
      }

      await expense.destroy();

      return res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (err) {
      console.error('Error deleting expense:', err);
      return res.status(500).json({ error: 'Failed to delete expense.' });
    }
  };

  const syncTransactions = async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).send('UserID is required');
      }

      const userBankAccounts = await UserBankAccounts.findAll({ where: { UserID: userId } });
      if (!userBankAccounts.length) {
        return res.status(404).send('No bank accounts found for the user');
      }

      for (const account of userBankAccounts) {
        const accountId = account.AccountNumber;
        const lastSyncedId = await getLastSyncedTransactionId(accountId);

        try {
          const response = await axios.get(`http://192.168.1.11:3001/bank/transactions/${accountId}/offset/${lastSyncedId}`);

          if (response.data.error === "Account not found") {
            continue;
          }

          const transactions = response.data?.transactions;

          if (!transactions || transactions.length === 0) {
            continue;
          }

          const expenses = transactions.map(tx => ({
            TransactionID: tx.TransactionID,
            UserID: userId,
            Amount: tx.amount,
            Description: "bank",
            Date: tx.createdAt,
            TransactionType: tx.type,
            Merchandise: tx.merchant || null,
            CategoryID: tx.category || 1,
          }));

          await Expenses.bulkCreate(expenses);

          await updateLastSyncedTransactionId(accountId, transactions[transactions.length - 1].TransactionID);
        } catch (err) {
          console.error(`Error syncing transactions for account ${accountId}:`, err.message);
          continue;
        }
      }

      return res.status(200).send('Transactions synced successfully');
    } catch (err) {
      console.error("Error syncing transactions:", err.message);
      return res.status(500).send('An error occurred while syncing transactions');
    }
  };

  const getLastSyncedTransactionId = async (accountId) => {
    try {
      const account = await UserBankAccounts.findOne({
        where: { AccountNumber: accountId },
        attributes: ['Offset'],
      });

      return account?.Offset || 0;
    } catch (error) {
      console.error(`Error retrieving last synced transaction ID for account ${accountId}:`, error);
      return 0;
    }
  };

  const updateLastSyncedTransactionId = async (accountId, lastTransactionId) => {
    try {
      await UserBankAccounts.update(
        { Offset: lastTransactionId },
        { where: { AccountNumber: accountId } }
      );
    } catch (error) {
      console.error(`Error updating last synced transaction ID for account ${accountId}:`, error);
    }
  };

  return {
    getExpensesForUser,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense,
    syncTransactions,
  };
};
