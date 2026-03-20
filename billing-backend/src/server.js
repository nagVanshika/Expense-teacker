require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});
