const httpMocks = require('node-mocks-http');
const crypto = require('crypto');

const mockBudgetInstance = {
  BudgetID: 1,
  BudgetName: 'Test Budget',
  UserID: 123,
  Amount: 1000.00,
  AmountSpent: 100.00,
  StartDate: new Date('2024-01-01'),
  EndDate: new Date('2024-12-31'),
  toJSON: function () {
    return { ...this };
  },
  update: jest.fn(function (fields) {
    Object.assign(this, fields);
    return Promise.resolve(this);
  }),
  destroy: jest.fn(() => Promise.resolve()),
};

const mockBudgets = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

const mockExpenses = {
  sum: jest.fn(),
};

describe('Budget Controller Unit Tests (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSequelize = {
      define: () => mockBudgets,
    };

    controller = require('../controllers/budgetController')(mockSequelize);
    controller.__setExpenses = (mock) => mockExpenses; // optional for extensibility
  });

  test('getBudgetsForUser - returns budgets with updated spent amounts', async () => {
    mockBudgets.findAll.mockResolvedValue([mockBudgetInstance]);
    mockExpenses.sum.mockResolvedValue(50);

    const req = httpMocks.createRequest({
      method: 'GET',
      params: { userId: 123 },
    });

    const res = httpMocks.createResponse();
    controller = require('../controllers/budgetController')({
      define: (modelName) => (modelName === 'Budgets' ? mockBudgets : mockExpenses),
    });

    await controller.getBudgetsForUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data[0].AmountSpent).toBe(150);
  });

  test('getBudgetById - found', async () => {
    mockBudgets.findByPk.mockResolvedValue(mockBudgetInstance);

    const req = httpMocks.createRequest({ params: { budgetId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getBudgetById(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data.BudgetName).toBe('Test Budget');
  });

  test('getBudgetById - not found', async () => {
    mockBudgets.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { budgetId: 999 } });
    const res = httpMocks.createResponse();

    await controller.getBudgetById(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Budget not found.');
  });

  test('createBudget - success', async () => {
    mockBudgets.create.mockResolvedValue(mockBudgetInstance);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        BudgetName: 'New Budget',
        UserID: 123,
        Amount: 2000,
        AmountSpent: 0,
        StartDate: new Date(),
        EndDate: new Date(),
      },
    });

    const res = httpMocks.createResponse();
    await controller.createBudget(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.message).toBe('Budget created successfully.');
  });

  test('updateBudget - success', async () => {
    mockBudgets.findByPk.mockResolvedValue(mockBudgetInstance);

    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { budgetId: 1 },
      body: {
        BudgetName: 'Updated Budget',
        Amount: 1500,
        AmountSpent: 300,
        StartDate: new Date(),
        EndDate: new Date(),
      },
    });

    const res = httpMocks.createResponse();
    await controller.updateBudget(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe('Budget updated successfully.');
  });

  test('updateBudget - not found', async () => {
    mockBudgets.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { budgetId: 99 },
      body: {},
    });

    const res = httpMocks.createResponse();
    await controller.updateBudget(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Budget not found.');
  });

  test('deleteBudget - success', async () => {
    mockBudgets.findByPk.mockResolvedValue(mockBudgetInstance);

    const req = httpMocks.createRequest({ params: { budgetId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteBudget(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data.message).toBe('Budget deleted successfully.');
  });

  test('deleteBudget - not found', async () => {
    mockBudgets.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { budgetId: 404 } });
    const res = httpMocks.createResponse();

    await controller.deleteBudget(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Budget not found.');
  });
});
