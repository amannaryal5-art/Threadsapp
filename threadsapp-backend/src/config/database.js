const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.warn('MongoDB connection skipped: MONGODB_URI is not configured');
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
};

module.exports = { connectDB };
