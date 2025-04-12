const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const categoryController = require('../controllers/categoryController')(sequelize);

  router.get('/', categoryController.getCategories);
  router.get('/:categoryId', categoryController.getCategoryById);
  router.post('/', categoryController.createCategory);
  router.put('/:categoryId', categoryController.updateCategory);
  router.delete('/:categoryId', categoryController.deleteCategory);

  return router;
};
