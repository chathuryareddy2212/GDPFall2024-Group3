const cron = require('node-cron');
const axios = require('axios');
const db = require('../db'); 
const { REACT_APP_API } = require('../config');
const statisticsController=require('../controllers/statisticsController')(sequelize);

const runDailySnapshot = async () => {
  try {
    const users = await db.query('SELECT id FROM Users');
    for (const user of users) {
      const userId = user.id;

      expenses = statisticsController.getExpensesForUser()

      const jsonData = JSON.stringify({
        expenses: expenses.data,
        budgets: budgets.data,
        savings: savings.data,
      });

      const today = new Date().toISOString().split("T")[0];

      await db.query(
        `INSERT INTO FinancialRecords (user_id, record_date, json_data)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE json_data = VALUES(json_data), updated_at = CURRENT_TIMESTAMP`,
        [userId, today, jsonData]
      );

      console.log(`Snapshot stored for user ${userId} at ${today}`);
    }
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
};

// Schedule: Every day at 11:59 PM
cron.schedule('59 23 * * *', runDailySnapshot);

module.exports = runDailySnapshot;
