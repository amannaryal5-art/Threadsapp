require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const ApiResponse = require('./utils/ApiResponse');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(generalLimiter);
app.use('/api/v1/auth/send-otp', otpLimiter);
app.use('/api/v1/auth/verify-otp', otpLimiter);

app.get('/api/v1/health', async (_req, res) => {
  let database = 'down';

  try {
    await sequelize.authenticate();
    database = 'up';
  } catch (error) {
    logger.error(`Health database error: ${error.message}`);
  }

  return ApiResponse.success(res, 'Health check fetched successfully', {
    database,
    cache: 'in-memory',
    uptime: process.uptime(),
    platform: process.env.PLATFORM_NAME || 'ThreadsApp',
  });
});

app.use('/api/v1', routes);
app.use((_req, res) => ApiResponse.error(res, 'Route not found', [{ field: 'route', message: 'The requested resource does not exist' }], 404));
app.use(errorMiddleware);

module.exports = app;
