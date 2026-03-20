const categoryService = require('../services/category.service');

/**
 * GET /api/v1/categories?status=active|inactive|all
 */
const getCategories = async (req, res, next) => {
  try {
    const status = req.query.status || 'active'; // Default to active for most UI needs
    const type = req.query.type || 'all';
    const categories = await categoryService.getCategories(status, type);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description, type } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const category = await categoryService.createCategory({ name, description, type: type || 'expense' });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category name already exists' });
    }
    next(error);
  }
};

/**
 * PUT /api/v1/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, type } = req.body;
    const category = await categoryService.updateCategory(req.params.id, { name, description, type });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category name already exists' });
    }
    next(error);
  }
};

/**
 * DELETE /api/v1/categories/:id  — SOFT DELETE (marks inactive)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, data: category, message: 'Category marked as inactive' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
