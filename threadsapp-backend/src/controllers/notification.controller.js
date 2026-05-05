const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification.service');

exports.broadcast = asyncHandler(async (req, res) => {
  const count = await notificationService.broadcast({
    title: req.body.title,
    body: req.body.body,
    type: req.body.type,
    data: req.body.data,
    where: req.body.segment || {},
  });
  return ApiResponse.success(res, 'Broadcast sent successfully', { recipients: count });
});
