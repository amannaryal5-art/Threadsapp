const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

function parseBoolean(value, fallback = false) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'threads',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: parseBoolean(process.env.DB_LOGGING, false) ? (message) => logger.info(message) : false,
    dialectOptions:
      process.env.NODE_ENV === 'production'
        ? {
            ssl: { require: true, rejectUnauthorized: false },
          }
        : undefined,
  },
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    logger.info(
      `PostgreSQL connected: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'threads'}`,
    );

    if (parseBoolean(process.env.DB_SYNC, false)) {
      await sequelize.sync();
      logger.info('Sequelize models synchronized successfully');
    }

    return sequelize;
  } catch (error) {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = {
  connectDB,
  sequelize,
};
