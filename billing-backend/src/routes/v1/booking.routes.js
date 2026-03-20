const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/collections', bookingController.getCollections);
router.post('/collections', restrictTo('super_admin'), bookingController.createCollection);

module.exports = router;
