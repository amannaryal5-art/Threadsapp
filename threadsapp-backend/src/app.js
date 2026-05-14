require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const routes = require('./routes');
const { sequelize } = require('./config/database');
const { getEmailProviderStatus } = require('./services/emailService');
const logger = require('./utils/logger');
const ApiResponse = require('./utils/ApiResponse');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const allowedOrigins = new Set(
  [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    ...configuredOrigins,
  ].filter(Boolean),
);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for authenticated requests to /addresses
    return req.path.includes('/addresses') && req.user;
  },
});

const addressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET',
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
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      if (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && /\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(generalLimiter);
app.use('/api/v1/addresses', addressLimiter);
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

  const email = getEmailProviderStatus();

  return ApiResponse.success(res, 'Health check fetched successfully', {
    database,
    cache: 'in-memory',
    email,
    uptime: process.uptime(),
    platform: process.env.PLATFORM_NAME || 'ThreadsApp',
  });
});

app.use('/api/v1', routes);
app.use((_req, res) => ApiResponse.error(res, 'Route not found', [{ field: 'route', message: 'The requested resource does not exist' }], 404));
app.use(errorMiddleware);

module.exports = app;
