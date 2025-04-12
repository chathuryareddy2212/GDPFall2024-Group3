const httpMocks = require('node-mocks-http');

const mockExpense = {
  Amount: '100.00',
  Date: new Date(),
  TransactionType: 'debit',
  BudgetID: 1,
  GoalID: 1
};

const mockBudget = {
  BudgetID: 1,
  Amount: 500,
  Category: 'Food',
};

const mockGoal = {
  GoalID: 1,
  Amount: 300,
  Category: 'Vacation'
};

const mockExpensesModel = {
  findAll: jest.fn(),
};

const mockBudgetsModel = {
  findAll: jest.fn(),
};

const mockSavingGoalsModel = {
  findAll: jest.fn(),
};

describe('Analytics Controller (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSequelize = {
      define: (name) => {
        if (name === 'Expenses') return mockExpensesModel;
        if (name === 'Budgets') return mockBudgetsModel;
        if (name === 'SavingGoals') return mockSavingGoalsModel;
      }
    };

    controller = require('../controllers/statisticsController')(mockSequelize);
  });

  test('getExpensesForUser - success', async () => {
    mockExpensesModel.findAll.mockResolvedValue([mockExpense]);

    const req = httpMocks.createRequest({ params: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getExpensesForUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.weeklyExpenseBreakdown).toBeDefined();
    expect(data.monthlyExpenseBreakdown).toBeDefined();
    expect(data.yearlyExpenseBreakdown).toBeDefined();
  });

  test('getBudgetsReportsForUser - success', async () => {
    mockBudgetsModel.findAll.mockResolvedValue([mockBudget]);
    mockExpensesModel.findAll.mockResolvedValue([mockExpense]);

    const req = httpMocks.createRequest({ params: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getBudgetsReportsForUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.Budgets).toHaveLength(1);
  });

  test('getSavingGoalsReportsForUser - success', async () => {
    mockSavingGoalsModel.findAll.mockResolvedValue([mockGoal]);
    mockExpensesModel.findAll.mockResolvedValue([mockExpense]);

    const req = httpMocks.createRequest({ params: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getSavingGoalsReportsForUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.Budgets).toHaveLength(1);
  });
});
