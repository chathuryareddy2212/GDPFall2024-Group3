const crypto = require('crypto');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserBankAccounts = sequelize.define('UserBankAccounts', {
    UserBankAccountID: {
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
    BankID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BankDetails',
        key: 'BankID',
      },
    },
    AccountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    AccountBalance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    Offset: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  if (typeof UserBankAccounts.beforeCreate === 'function') {
    UserBankAccounts.beforeCreate((account) => {
      account.AccountNumber = crypto
        .createHash('sha256')
        .update(account.AccountNumber)
        .digest('hex');
    });
  }

  if (UserBankAccounts && UserBankAccounts.prototype) {
    UserBankAccounts.prototype.validateAccountNumber = function (accountNumber) {
      const hashed = crypto.createHash('sha256').update(accountNumber).digest('hex');
      return this.AccountNumber === hashed;
    };
  }

  return UserBankAccounts;
};
