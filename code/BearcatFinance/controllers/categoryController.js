module.exports = (sequelize) => {
  const Category = require('../models/categories')(sequelize);

  const getCategories = async (req, res) => {
    try {
      const categories = await Category.findAll();
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: 'No categories found.' });
      }
      return res.status(200).json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Failed to fetch categories.' });
    }
  };

  const getCategoryById = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
      return res.status(200).json(category);
    } catch (err) {
      console.error('Error fetching category details:', err);
      return res.status(500).json({ error: 'Failed to fetch category details.' });
    }
  };

  const createCategory = async (req, res) => {
    try {
      const categoryData = req.body;
      const newCategory = await Category.create(categoryData);
      return res.status(201).json(newCategory);
    } catch (err) {
      console.error('Error creating category:', err);
      return res.status(500).json({ error: 'Failed to create category.' });
    }
  };

  const updateCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
      await category.update({ name, description });
      return res.status(200).json({
        message: 'Category updated successfully.',
        category,
      });
    } catch (err) {
      console.error('Error updating category:', err);
      return res.status(500).json({ error: 'Failed to update category.' });
    }
  };

  const deleteCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
      await category.destroy();
      return res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Failed to delete category.' });
    }
  };

  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
