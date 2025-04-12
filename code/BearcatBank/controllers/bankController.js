const user = require('../models/user');
const {Sequelize} = require('sequelize');

module.exports = (sequelize) => {
  const BankAccount = require('../models/bankAccount')(sequelize);
  const Transaction = require('../models/transaction')(sequelize);

  const createBankAccount = async (req, res) => {
    const { customer_userID,AccountNumber } = req.body;

    // admin_userID = req.user.role === 'admin' ? req.user.userID : null;
    // if(admin_userID === null){
    //   return res.status(401).json({ error: 'Unauthorized access' });
    // }
    try {
      userID = customer_userID;
      const existingAccount = await BankAccount.findOne({ where: { userID } });
      if (existingAccount) {
        return res.status(400).json({ error: 'Account already exists' });
      }

      const account = await BankAccount.create({ AccountNumber, userID });
      res.status(201).json({ message: 'Bank account created successfully', account });
    } catch (err) {
      console.error('Error creating bank account:', err);
      res.status(500).json({ error: 'An error occurred while creating the bank account.' });
    }
  };

  const addTransaction = async (req, res) => {
    // userID = req.user.userID;
    const { amount, type, Products, userID } = req.body;

    try {
      const account = await BankAccount.findOne({ where: { userID } });
      console.log("account::::::::::::",account);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      if (!['deposit', 'withdrawal'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }

      const newBalance =
        type === 'deposit' ? account.balance + amount : account.balance - amount;

      if (type === 'withdrawal' && newBalance < 0) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      account.balance = newBalance;
      await account.save();
      const AccountNumber = account.AccountNumber;
      const transaction = await Transaction.create({ AccountNumber, amount, type, Products });
      res.status(201).json({ message: 'Transaction added successfully', transaction });
    } catch (err) {
      console.error('Error adding transaction:', err);
      res.status(500).json({ error: 'An error occurred while adding the transaction.' });
    }
  };

  const getAllTransactions = async (req, res) => {
    const { AccountNumber,offset } = req.params;

    console.log()

    try {
      const account = await BankAccount.findOne({ where: { AccountNumber } });
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const transactions = await Transaction.findAll({ where: { AccountNumber , TransactionID: { [Sequelize.Op.gt]: offset },} });
      res.status(200).json({
        message: 'Transactions fetched successfully',
        transactions,
      });
    } catch (err) {
      console.error('Error fetching transactions:', err);
      res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
  };

  return { createBankAccount, addTransaction, getAllTransactions };
};
