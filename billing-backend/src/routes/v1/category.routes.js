const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');

// Protect all routes
router.use(protect);

router.get('/', categoryController.getCategories);

// Only super_admin can modify categories
router.post('/', restrictTo('super_admin'), categoryController.createCategory);
router.put('/:id', restrictTo('super_admin'), categoryController.updateCategory);
router.delete('/:id', restrictTo('super_admin'), categoryController.deleteCategory);

module.exports = router;
