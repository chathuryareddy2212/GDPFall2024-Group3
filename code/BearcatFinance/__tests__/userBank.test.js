const httpMocks = require('node-mocks-http');

const mockBankDetailsModel = {
  findAll: jest.fn(),
};

const mockUserBankAccountsModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockAccount = {
    AccountNumber: '123',
    BankID: 1,
    toJSON: function () {
      return { AccountNumber: this.AccountNumber, BankID: this.BankID };
    },
    update: jest.fn(),
    destroy: jest.fn(),
  };
  

describe('User Bank Account Controller Unit Tests (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSequelize = {
      define: (name) => {
        if (name === 'UserBankAccounts') return mockUserBankAccountsModel;
        if (name === 'BankDetails') return mockBankDetailsModel;
      },
    };

    controller = require('../controllers/userBankAccountController')(mockSequelize);
  });

  test('getAllUserAccounts - returns list of accounts with bank names', async () => {
    mockUserBankAccountsModel.findAll.mockResolvedValue([mockAccount]);
    mockBankDetailsModel.findAll.mockResolvedValue([{ BankID: 1, BankName: 'Test Bank' }]);

    const req = httpMocks.createRequest({ user: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getAllUserAccounts(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data[0].BankName).toBe('Test Bank');
  });

  test('getAllUserAccounts - returns empty array if no accounts', async () => {
    mockUserBankAccountsModel.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest({ user: { userId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getAllUserAccounts(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });

  test('getAccountById - success', async () => {
    mockUserBankAccountsModel.findByPk.mockResolvedValue(mockAccount);

    const req = httpMocks.createRequest({ params: { accountId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getAccountById(req, res);

    expect(res.statusCode).toBe(200);
  });

  test('getAccountById - not found', async () => {
    mockUserBankAccountsModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { accountId: 99 } });
    const res = httpMocks.createResponse();

    await controller.getAccountById(req, res);

    expect(res.statusCode).toBe(404);
  });

  test('addAccount - success', async () => {
    mockUserBankAccountsModel.create.mockResolvedValue(mockAccount);

    const req = httpMocks.createRequest({ body: { UserID: 1, BankID: 1 } });
    const res = httpMocks.createResponse();

    await controller.addAccount(req, res);

    expect(res.statusCode).toBe(201);
  });

  test('updateAccount - success', async () => {
    mockUserBankAccountsModel.findByPk.mockResolvedValue(mockAccount);

    const req = httpMocks.createRequest({
      params: { accountId: 1 },
      body: { UserID: 1, BankID: 2, AccountNumber: '456', AccountBalance: 1000 },
    });
    const res = httpMocks.createResponse();

    await controller.updateAccount(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockAccount.update).toHaveBeenCalled();
  });

  test('updateAccount - not found', async () => {
    mockUserBankAccountsModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { accountId: 1 }, body: {} });
    const res = httpMocks.createResponse();

    await controller.updateAccount(req, res);

    expect(res.statusCode).toBe(404);
  });

  test('deleteAccount - success', async () => {
    mockUserBankAccountsModel.findByPk.mockResolvedValue(mockAccount);

    const req = httpMocks.createRequest({ params: { accountId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteAccount(req, res);

    expect(res.statusCode).toBe(200);
    expect(mockAccount.destroy).toHaveBeenCalled();
  });

  test('deleteAccount - not found', async () => {
    mockUserBankAccountsModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { accountId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteAccount(req, res);

    expect(res.statusCode).toBe(404);
  });
});
