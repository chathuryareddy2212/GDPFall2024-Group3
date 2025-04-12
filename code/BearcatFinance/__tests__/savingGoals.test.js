const httpMocks = require('node-mocks-http');

const mockGoal = {
  GoalID: 1,
  UserID: 1,
  GoalName: 'New Laptop',
  TargetAmount: '1000.00',
  CurrentAmount: '200.00',
  Deadline: new Date(),
  toJSON: function () { return this; },
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockSavingGoalsModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

const mockExpensesModel = {
  sum: jest.fn(),
};

describe('Saving Goals Controller (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSequelize = {
      define: (name) => {
        if (name === 'SavingGoals') return mockSavingGoalsModel;
        if (name === 'Expenses') return mockExpensesModel;
      },
    };

    controller = require('../controllers/savingGoalsController')(mockSequelize);
  });

  test('getSavingGoalsForUser - success', async () => {
    mockSavingGoalsModel.findAll.mockResolvedValue([mockGoal]);
    mockExpensesModel.sum.mockResolvedValue(300);

    const req = httpMocks.createRequest({ params: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getSavingGoalsForUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data[0].CurrentAmount).toBe(500); // 200 (initial) + 300 (expenses sum)
  });

  test('getSavingGoalById - success', async () => {
    mockSavingGoalsModel.findByPk.mockResolvedValue(mockGoal);

    const req = httpMocks.createRequest({ params: { goalId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getSavingGoalById(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().GoalName).toBe('New Laptop');
  });

  test('addSavingGoal - success', async () => {
    mockSavingGoalsModel.create.mockResolvedValue(mockGoal);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: mockGoal,
    });
    const res = httpMocks.createResponse();

    await controller.addSavingGoal(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.goal.GoalName).toBe('New Laptop');
  });

  test('updateSavingGoal - success', async () => {
    mockSavingGoalsModel.findByPk.mockResolvedValue(mockGoal);

    const req = httpMocks.createRequest({
      params: { goalId: 1 },
      body: { GoalName: 'Updated Goal' },
    });
    const res = httpMocks.createResponse();

    await controller.updateSavingGoal(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockGoal.update).toHaveBeenCalledWith({ GoalName: 'Updated Goal' });
  });

  test('deleteSavingGoal - success', async () => {
    mockSavingGoalsModel.findByPk.mockResolvedValue(mockGoal);

    const req = httpMocks.createRequest({ params: { goalId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteSavingGoal(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockGoal.destroy).toHaveBeenCalled();
  });
});
