const ApiError = require('../utils/ApiError');

module.exports = (schema, source = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });

  if (error) {
    return next(
      new ApiError(
        422,
        'Validation failed',
        error.details.map((item) => ({ field: item.path.join('.'), message: item.message })),
      ),
    );
  }

  req[source] = value;
  return next();
};
