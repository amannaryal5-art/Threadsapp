const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const couponService = require('../services/coupon.service');

exports.applyCoupon = asyncHandler(async (req, res) => {
  const result = await couponService.validateCoupon({ ...req.body, userId: req.user.id });
  return ApiResponse.success(res, 'Coupon applied successfully', { coupon: result.coupon, discountAmount: result.discountAmount });
});

exports.removeCoupon = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Coupon removed successfully', {}));
