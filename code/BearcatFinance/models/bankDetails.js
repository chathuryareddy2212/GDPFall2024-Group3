const crypto = require('crypto');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BankDetails = sequelize.define('BankDetails', {
    BankID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    BankApiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  if (typeof BankDetails.beforeCreate === 'function') {
    BankDetails.beforeCreate((bank) => {
      bank.BankApiKey = crypto.createHash('sha256').update(bank.BankApiKey).digest('hex');
    });
  }

  if (BankDetails && BankDetails.prototype) {
    BankDetails.prototype.verifyApiKey = function (apiKey) {
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      return this.BankApiKey === hashedKey;
    };
  }

  return BankDetails;
};
