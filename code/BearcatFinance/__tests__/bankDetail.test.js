const httpMocks = require('node-mocks-http');
const crypto = require('crypto');

const mockBank = {
  BankID: 1,
  BankName: 'Mock Bank',
  BankApiKey: crypto.createHash('sha256').update('secret123').digest('hex'),
  destroy: jest.fn(),
  update: jest.fn(function (fields) {
    Object.assign(this, fields);
    return Promise.resolve(this);
  }),
};

const mockBankModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

describe('Bank Details Controller Unit Tests (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockSequelize = {
      define: () => mockBankModel,
    };
    controller = require('../controllers/bankDetailsController')(mockSequelize);
  });

  test('getAllBanksDetails - success', async () => {
    mockBankModel.findAll.mockResolvedValue([mockBank]);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await controller.getAllBanksDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toHaveLength(1);
  });

  test('getAllBanksDetails - no banks', async () => {
    mockBankModel.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await controller.getAllBanksDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('No bank details found.');
  });

  test('getBankDetailsById - success', async () => {
    mockBankModel.findByPk.mockResolvedValue(mockBank);

    const req = httpMocks.createRequest({ params: { bankId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getBankDetailsById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.BankName).toBe('Mock Bank');
  });

  test('getBankDetailsById - not found', async () => {
    mockBankModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { bankId: 404 } });
    const res = httpMocks.createResponse();

    await controller.getBankDetailsById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Bank not found.');
  });

  test('addBankDetails - success', async () => {
    mockBankModel.create.mockResolvedValue(mockBank);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        BankName: 'New Bank',
        BankApiKey: 'secret123',
      },
    });

    const res = httpMocks.createResponse();
    await controller.addBankDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.BankName).toBe('Mock Bank');
  });

  test('updateBankDetails - success', async () => {
    mockBankModel.findByPk.mockResolvedValue(mockBank);

    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { bankId: 1 },
      body: {
        BankName: 'Updated Bank',
        BankApiKey: 'newsecret',
      },
    });

    const res = httpMocks.createResponse();
    await controller.updateBankDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe('Bank details updated successfully.');
    expect(mockBank.update).toHaveBeenCalledWith({
      BankName: 'Updated Bank',
      BankApiKey: crypto.createHash('sha256').update('newsecret').digest('hex'),
    });
  });

  test('updateBankDetails - not found', async () => {
    mockBankModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { bankId: 999 } });
    const res = httpMocks.createResponse();

    await controller.updateBankDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Bank not found.');
  });

  test('deleteBankDetails - success', async () => {
    mockBankModel.findByPk.mockResolvedValue(mockBank);

    const req = httpMocks.createRequest({ params: { bankId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteBankDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe('Bank deleted successfully.');
  });

  test('deleteBankDetails - not found', async () => {
    mockBankModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { bankId: 404 } });
    const res = httpMocks.createResponse();

    await controller.deleteBankDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Bank not found.');
  });
});
