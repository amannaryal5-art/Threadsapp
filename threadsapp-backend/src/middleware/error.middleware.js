const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

module.exports = (error, _req, res, _next) => {
  if (error?.name === 'TokenExpiredError') {
    logger.error('Expired token', { stack: error.stack });
    return ApiResponse.error(res, 'jwt expired', [], 401);
  }

  if (error?.name === 'JsonWebTokenError') {
    logger.error('Invalid token', { stack: error.stack });
    return ApiResponse.error(res, 'Invalid token', [], 401);
  }

  if (error?.name === 'SequelizeUniqueConstraintError') {
    const errors = (error.errors || []).map((item) => ({
      field: item.path || 'field',
      message: item.message || 'Value already exists',
    }));

    logger.error('Duplicate value error', { stack: error.stack, errors });
    return ApiResponse.error(res, 'A record with the same value already exists', errors, 409);
  }

  if (error?.name === 'SequelizeValidationError') {
    const errors = (error.errors || []).map((item) => ({
      field: item.path || 'field',
      message: item.message || 'Validation failed',
    }));

    logger.error('Validation error', { stack: error.stack, errors });
    return ApiResponse.error(res, 'Validation failed', errors, 422);
  }

  if (error?.code === 11000) {
    const duplicateFields = Object.keys(error.keyPattern || error.keyValue || {});
    const errors = duplicateFields.map((field) => ({
      field,
      message: `${field} already exists`,
    }));

    logger.error('Mongo duplicate value error', { stack: error.stack, errors });
    return ApiResponse.error(res, 'A record with the same value already exists', errors, 409);
  }

  if (error?.name === 'ValidationError') {
    const errors = Object.entries(error.errors || {}).map(([field, value]) => ({
      field,
      message: value.message || 'Validation failed',
    }));

    logger.error('Mongo validation error', { stack: error.stack, errors });
    return ApiResponse.error(res, 'Validation failed', errors, 422);
  }

  logger.error(error.message, { stack: error.stack, errors: error.errors });

  return ApiResponse.error(res, error.message || 'Internal server error', error.errors || [], error.statusCode || 500);
};
