const crypto = require('crypto');

module.exports = (sequelize) => {
  const BankDetails = require('../models/bankDetails')(sequelize);

  const getAllBanksDetails = async (req, res) => {
    try {
      const banks = await BankDetails.findAll();
      if (!banks || banks.length === 0) {
        return res.status(404).json({ message: 'No bank details found.' });
      }
      return res.status(200).json(banks);
    } catch (err) {
      console.error('Error fetching bank details:', err);
      return res.status(500).json({ error: 'Failed to fetch bank details.' });
    }
  };

  const getBankDetailsById = async (req, res) => {
    try {
      const { bankId } = req.params;
      const bank = await BankDetails.findByPk(bankId);
      if (!bank) {
        return res.status(404).json({ message: 'Bank not found.' });
      }
      return res.status(200).json(bank);
    } catch (err) {
      console.error('Error fetching bank detail:', err);
      return res.status(500).json({ error: 'Failed to fetch bank detail.' });
    }
  };

  const addBankDetails = async (req, res) => {
    try {
      const bankData = req.body;
      const newBank = await BankDetails.create(bankData);
      return res.status(201).json(newBank);
    } catch (err) {
      console.error('Error creating bank detail:', err);
      return res.status(500).json({ error: 'Failed to create bank detail.' });
    }
  };

  const updateBankDetails = async (req, res) => {
    try {
      const { bankId } = req.params;
      const { BankName, BankApiKey } = req.body;
      const bank = await BankDetails.findByPk(bankId);
      if (!bank) {
        return res.status(404).json({ message: 'Bank not found.' });
      }

      let updatedData = { BankName };
      if (BankApiKey) {
        updatedData.BankApiKey = crypto.createHash('sha256').update(BankApiKey).digest('hex');
      }

      await bank.update(updatedData);
      return res.status(200).json({
        message: 'Bank details updated successfully.',
        bank,
      });
    } catch (err) {
      console.error('Error updating bank detail:', err);
      return res.status(500).json({ error: 'Failed to update bank detail.' });
    }
  };

  const deleteBankDetails = async (req, res) => {
    try {
      const { bankId } = req.params;
      const bank = await BankDetails.findByPk(bankId);
      if (!bank) {
        return res.status(404).json({ message: 'Bank not found.' });
      }
      await bank.destroy();
      return res.status(200).json({ message: 'Bank deleted successfully.' });
    } catch (err) {
      console.error('Error deleting bank detail:', err);
      return res.status(500).json({ error: 'Failed to delete bank detail.' });
    }
  };

  return {
    getAllBanksDetails,
    getBankDetailsById,
    addBankDetails,
    updateBankDetails,
    deleteBankDetails,
  };
};
