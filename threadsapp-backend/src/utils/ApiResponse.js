class ApiResponse {
  static success(res, message, data = {}, meta = undefined, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  }

  static error(res, message, errors = [], statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}

module.exports = ApiResponse;
