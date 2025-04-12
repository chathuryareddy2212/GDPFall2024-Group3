const { redisSubscriber } = require('../redisClient');
// const { updateBudgets } = require('./budgetService');
// const { updateSavingsGoals } = require('./savingsService');

redisSubscriber.subscribe('transactions.sync', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log(`Subscribed successfully to ${count} Redis channel(s).`);
  }
});

// Listen for new transactions using the correct Redis subscriber
redisSubscriber.on('message', async (channel, message) => {
  if (channel === 'transactions.sync') {
    console.log('Received new transactions:', message);

    try {
    //   const transactions = JSON.parse(message);
      
    console.log("Subscriber is Working ...");
    console.log("Here is the message: ", message);
      // Update budgets based on transactions
      // await updateBudgets(transactions);

      // Update savings goals based on transactions
      // await updateSavingsGoals(transactions);
    } catch (err) {
      console.error('Error parsing the transaction message:', err);
    }
  }
});
