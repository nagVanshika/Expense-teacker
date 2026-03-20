const bookingService = require('../services/booking.service');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../config/logger');
const { sendSlackNotification } = require('../utils/slack');

const getCollections = async (req, res, next) => {
// ...
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { dateFrom, dateTo, region, category, period } = req.query;
    
    const filters = { dateFrom, dateTo, region, category };
    const data = await bookingService.getBookingsList(page, limit, filters);
    const filtersData = await bookingService.getCollectionFilters();
    
    res.status(200).json({ 
      success: true, 
      data: {
        ...data,
        filters: filtersData,
        stats: await bookingService.getCollectionStats(period, dateFrom, dateTo),
        revenueTrend: await bookingService.getRevenueTrend(period, dateFrom, dateTo),
        regionWiseRevenue: await bookingService.getRegionWiseRevenue(period, dateFrom, dateTo)
      } 
    });
  } catch (error) {
    logger.error('Error in getCollections controller:', error);
    next(error);
  }
};

const createCollection = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);

    // Populate category to get the name for Slack
    if (booking.category) {
      await booking.populate('category', 'name');
    }

    // Send Slack Notification
    sendSlackNotification({
      expense_id: booking._id,
      customerName: booking.customerName,
      categoryName: booking.category?.name || 'Manual',
      amount: booking.amount,
      channel: process.env.SLACK_CHANNEL || 'carmaa-bills-update',
      type: 'Collection'
    }).catch(err => console.error('Slack notification failed for collection:', err));

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Error in createCollection controller:', error);
    next(error);
  }
};

module.exports = {
  getCollections,
  createCollection
};
