const httpMocks = require('node-mocks-http');
const axios = require('axios');
const crypto = require('crypto');

jest.mock('axios');

// 🔒 Create mock User instance
const mockUser = {
  UserID: 1,
  username: 'MockUser',
  email: 'mock@example.com',
  phoneNumber: '1234567890',
  password: crypto.createHash('sha256').update('mockpassword').digest('hex'),
  destroy: jest.fn(),
  update: jest.fn(function (fields) {
    Object.assign(this, fields);
    return Promise.resolve(this);
  }),
};

// 🧠 Add the validatePassword method separately
mockUser.validatePassword = function (password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return this.password === hash;
};

// 🔧 Mock Sequelize model methods
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  beforeCreate: jest.fn(),
};

describe('User Controller Unit Tests (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockSequelize = {
      define: () => mockUserModel,
    };

    controller = require('../controllers/userController')(mockSequelize);
  });

  test('registerUser - success', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(mockUser);
    axios.post.mockResolvedValue({ status: 200 });

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        username: 'NewUser',
        email: 'new@example.com',
        phoneNum: '1111111111',
        password: 'secure123',
      },
    });

    const res = httpMocks.createResponse();
    await controller.registerUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.user.email).toBe('mock@example.com');
  });

  test('registerUser - existing user', async () => {
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        username: 'DupUser',
        email: 'mock@example.com',
        phoneNum: '1234567890',
        password: 'pass',
      },
    });

    const res = httpMocks.createResponse();
    await controller.registerUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().error).toBe('User already exists');
  });

  test('loginUser - success', async () => {
    mockUserModel.findOne.mockResolvedValue({
      ...mockUser,
      validatePassword: mockUser.validatePassword,
    });
    axios.post.mockResolvedValue({ status: 200 });

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'mock@example.com',
        password: 'mockpassword',
      },
    });

    const res = httpMocks.createResponse();
    await controller.loginUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe('mock@example.com');
  });

  test('loginUser - invalid password', async () => {
    mockUserModel.findOne.mockResolvedValue({
      ...mockUser,
      validatePassword: mockUser.validatePassword,
    });

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'mock@example.com',
        password: 'wrongpassword',
      },
    });

    const res = httpMocks.createResponse();
    await controller.loginUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(400);
    expect(data.error).toBe('Invalid credentials');
  });

  test('getUserDetails - success', async () => {
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const req = httpMocks.createRequest({
      method: 'GET',
      params: { userID: 1 },
    });

    const res = httpMocks.createResponse();
    await controller.getUserDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.user.username).toBe('MockUser');
  });

  test('getUserDetails - user not found', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      method: 'GET',
      params: { userID: 999 },
    });

    const res = httpMocks.createResponse();
    await controller.getUserDetails(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.error).toBe('User not found');
  });
});
