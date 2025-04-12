const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Expenses = sequelize.define('Expenses', {
    ExpenseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TransactionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    GoalID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'SavingGoals',
        key: 'GoalID',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    BudgetID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Budgets',
        key: 'BudgetID',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    Amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TransactionType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Merchandise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  if (typeof Expenses.beforeCreate === 'function') {
    Expenses.beforeCreate((expense) => {
      if (expense.Description) {
        expense.Description = expense.Description.trim();
      }
    });
  }

  if (Expenses && Expenses.prototype) {
    Expenses.prototype.getExpenseDetails = function () {
      return `Expense: ${this.Description || 'N/A'}, Amount: $${this.Amount}, Date: ${this.Date}`;
    };
  }

  return Expenses;
};
