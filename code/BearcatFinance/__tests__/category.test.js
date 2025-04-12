const httpMocks = require('node-mocks-http');

const mockCategory = {
  id: 1,
  name: 'Mock Category',
  description: 'Mock Description',
  destroy: jest.fn(),
  update: jest.fn(function (fields) {
    Object.assign(this, fields);
    return Promise.resolve(this);
  }),
};

const mockCategoryModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

describe('Category Controller Unit Tests (Mocked DB)', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockSequelize = {
      define: () => mockCategoryModel,
    };
    controller = require('../controllers/categoryController')(mockSequelize);
  });

  test('getCategories - success', async () => {
    mockCategoryModel.findAll.mockResolvedValue([mockCategory]);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await controller.getCategories(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toHaveLength(1);
  });

  test('getCategories - no categories', async () => {
    mockCategoryModel.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await controller.getCategories(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('No categories found.');
  });

  test('getCategoryById - success', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(mockCategory);

    const req = httpMocks.createRequest({ params: { categoryId: 1 } });
    const res = httpMocks.createResponse();

    await controller.getCategoryById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.name).toBe('Mock Category');
  });

  test('getCategoryById - not found', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { categoryId: 999 } });
    const res = httpMocks.createResponse();

    await controller.getCategoryById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Category not found.');
  });

  test('createCategory - success', async () => {
    mockCategoryModel.create.mockResolvedValue(mockCategory);

    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        name: 'New Category',
        description: 'Some description',
      },
    });

    const res = httpMocks.createResponse();
    await controller.createCategory(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data.name).toBe('Mock Category');
  });

  test('updateCategory - success', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(mockCategory);

    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { categoryId: 1 },
      body: {
        name: 'Updated Category',
        description: 'Updated description',
      },
    });

    const res = httpMocks.createResponse();
    await controller.updateCategory(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe('Category updated successfully.');
    expect(mockCategory.update).toHaveBeenCalledWith({
      name: 'Updated Category',
      description: 'Updated description',
    });
  });

  test('updateCategory - not found', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { categoryId: 404 } });
    const res = httpMocks.createResponse();

    await controller.updateCategory(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Category not found.');
  });

  test('deleteCategory - success', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(mockCategory);

    const req = httpMocks.createRequest({ params: { categoryId: 1 } });
    const res = httpMocks.createResponse();

    await controller.deleteCategory(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.message).toBe('Category deleted successfully.');
    expect(mockCategory.destroy).toHaveBeenCalled();
  });

  test('deleteCategory - not found', async () => {
    mockCategoryModel.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { categoryId: 404 } });
    const res = httpMocks.createResponse();

    await controller.deleteCategory(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.message).toBe('Category not found.');
  });
});
