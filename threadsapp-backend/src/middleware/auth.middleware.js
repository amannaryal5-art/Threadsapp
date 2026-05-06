const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const accessTokenSecret = process.env.NEXTAUTH_SECRET || process.env.JWT_ACCESS_SECRET;

exports.authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, accessTokenSecret);
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      throw new ApiError(401, 'jwt expired');
    }

    if (error?.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token');
    }

    throw error;
  }

  const user = await User.findById(decoded.id).select('+passwordHash');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or inactive');
  }

  req.user = user;
  next();
});
