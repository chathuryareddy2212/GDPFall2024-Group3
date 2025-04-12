const crypto = require('crypto');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SavingGoals = sequelize.define('SavingGoals', {
    GoalID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID',
      },
    },
    GoalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TargetAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    CurrentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    Deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  if (typeof SavingGoals.beforeCreate === 'function') {
    SavingGoals.beforeCreate((goal) => {
      goal.GoalName = goal.GoalName.trim();
    });
  }

  if (SavingGoals && SavingGoals.prototype) {
    SavingGoals.prototype.getRemainingAmount = function () {
      return this.TargetAmount - this.CurrentAmount;
    };
  }

  return SavingGoals;
};
