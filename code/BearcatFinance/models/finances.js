const { DataTypes } = require('sequelize');

// models/financialReports.js
module.exports = (sequelize) => {
    const FinancialReports = sequelize.define('FinancialReports', {
      snapshot_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      snapshot_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'FinancialReports',
      timestamps: false, 
    });
  
    return FinancialReports;
  };
  