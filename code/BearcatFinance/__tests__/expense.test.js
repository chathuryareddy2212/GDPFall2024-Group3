const httpMocks = require('node-mocks-http');
const axios = require('axios');
jest.mock('axios');

const mockExpense = {
  ExpenseID: 1,
  CategoryID: 10,
  TransactionType: 'debit',
  Amount: '50.00',
  Description: 'Groceries',
  GoalID: null,
  BudgetID: null,
  Merchandise: 'Supermarket',
  Date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  update: jest.fn(),
  destroy: jest.fn()
};

const mockCategory = {
  id: 10,
  name: 'Food'
};

const mockUserBankAccount = {
  AccountNumber: '1234567890',
  Offset: 100,
};

const mockExpensesModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  bulkCreate: jest.fn()
};

const mockCategoriesModel = {
  findAll: jest.fn()
};

const mockBankAccountsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn()
};

describe('Expenses Controller (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSequelize = {
      define: (name) => {
        if (name === 'Expenses') return mockExpensesModel;
        if (name === 'Categories') return mockCategoriesModel;
        if (name === 'UserBankAccounts') return mockBankAccountsModel;
      }
    };

    controller = require('../controllers/expenseController')(mockSequelize);
  });

  test('getExpensesForUser - returns grouped expenses', async () => {
    mockExpensesModel.findAll.mockResolvedValue([mockExpense]);
    mockCategoriesModel.findAll.mockResolvedValue([mockCategory]);

    const req = httpMocks.createRequest({ params: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getExpensesForUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.categorizedExpenses).toHaveLength(1);
  });

  test('getExpenseById - success', async () => {
    mockExpensesModel.findByPk.mockResolvedValue(mockExpense);

    const req = httpMocks.createRequest({ params: { expenseId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getExpenseById(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().Description).toBe('Groceries');
  });

  test('addExpense - success', async () => {
    mockExpensesModel.create.mockResolvedValue(mockExpense);

    const req = httpMocks.createRequest({
      user: { userId: 1 },
      body: { Amount: 50.0, CategoryID: 10 }
    });
    const res = httpMocks.createResponse();

    await controller.addExpense(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
  });

  test('updateExpense - success', async () => {
    mockExpensesModel.findByPk.mockResolvedValue(mockExpense);

    const req = httpMocks.createRequest({
      params: { expenseId: 1 },
      body: { Description: 'Updated' }
    });
    const res = httpMocks.createResponse();

    await controller.updateExpense(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockExpense.update).toHaveBeenCalledWith({ Description: 'Updated' });
  });

  test('deleteExpense - success', async () => {
    mockExpensesModel.findByPk.mockResolvedValue(mockExpense);

    const req = httpMocks.createRequest({ params: { expenseId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteExpense(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockExpense.destroy).toHaveBeenCalled();
  });

  test('syncTransactions - success with one account and new transactions', async () => {
    mockBankAccountsModel.findAll.mockResolvedValue([mockUserBankAccount]);
    mockBankAccountsModel.findOne.mockResolvedValue({ Offset: 100 });
    axios.get.mockResolvedValue({
      data: {
        transactions: [
          {
            TransactionID: 101,
            amount: 75.5,
            createdAt: new Date().toISOString(),
            type: 'debit',
            merchant: 'Store',
            category: 1
          }
        ]
      }
    });

    const req = httpMocks.createRequest({ params: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.syncTransactions(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockExpensesModel.bulkCreate).toHaveBeenCalled();
    expect(mockBankAccountsModel.update).toHaveBeenCalled();
  });
});
