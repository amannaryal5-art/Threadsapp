const { Return, Order, OrderItem } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.getMyReturns = asyncHandler(async (req, res) => {
  const returns = await Return.findAll({ where: { userId: req.user.id }, include: [Order, OrderItem], order: [['createdAt', 'DESC']] });
  return ApiResponse.success(res, 'Returns fetched successfully', { returns });
});

exports.getReturnDetail = asyncHandler(async (req, res) => {
  const itemReturn = await Return.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [Order, OrderItem] });
  if (!itemReturn) throw new ApiError(404, 'Return not found');
  return ApiResponse.success(res, 'Return fetched successfully', { return: itemReturn });
});
