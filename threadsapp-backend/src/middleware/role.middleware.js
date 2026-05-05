const ApiError = require('../utils/ApiError');

module.exports = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Access denied'));
  }
  return next();
};
