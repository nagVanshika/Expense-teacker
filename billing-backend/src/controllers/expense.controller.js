const expenseService = require('../services/expense.service');
const { sendSlackNotification } = require('../utils/slack');

/**
 * Get expenses with optional filters
 */
const getExpenses = async (req, res, next) => {
// ... (lines 7-36 remain same)
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      category: req.query.category,
      region:   req.query.region,
      status:   req.query.status,
      search:   req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo:   req.query.dateTo,
    };

    const data = await expenseService.getExpenses(filters, page, limit);
    const categories = await expenseService.getCategories();
    const regions = await expenseService.getRegions();

    res.status(200).json({
      success: true,
      data: {
        ...data,
        filters: {
          categories,
          regions
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new expense
 */
const createExpense = async (req, res, next) => {
  try {
    const expenseData = { ...req.body };
    
    // If file is uploaded, add its S3 location to expenseData
    if (req.file) {
      expenseData.attachment = req.file.location;
    }

    const expense = await expenseService.createExpense(expenseData);
    
    // Populate category to get the name for Slack
    await expense.populate('category', 'name');

    // Send Slack Notification
    sendSlackNotification({
      expense_id: expense._id,
      reason: expense.reason,
      amount: expense.amount,
      categoryName: expense.category?.name,
      paidBy: expense.paidBy,
      channel: process.env.SLACK_CHANNEL || 'carmaa-bills-update',
      type: 'Expense'
    }).catch(err => console.error('Slack notification failed:', err));

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expense statistics for charts
 */
const getExpenseStats = async (req, res, next) => {
  try {
    const { period, dateFrom, dateTo } = req.query;
    const categoryStats = await expenseService.getExpenseCategoryStats(period, dateFrom, dateTo);

    res.status(200).json({
      success: true,
      data: {
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all distinct regions
 */
const getRegions = async (req, res, next) => {
  try {
    const regions = await expenseService.getRegions();
    res.status(200).json({ success: true, data: regions });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk upload expenses from Excel
 */
const bulkUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
    }

    const result = await expenseService.bulkUploadExpenses(req.file.buffer);

    // Send Slack Notification for bulk upload
    sendSlackNotification({
      expense_id: 'Multiple',
      reason: `Bulk Upload: ${result.count} expenses`,
      amount: result.totalAmount || 'Check Dashboard',
      channel: process.env.SLACK_CHANNEL || 'carmaa-bills-update',
      type: 'full_message'
    }).catch(err => console.error('Slack notification failed:', err));

    res.status(200).json({
      success: true,
      data: result,
      message: `Successfully imported ${result.count} expenses`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseStats,
  getRegions,
  bulkUpload
};
