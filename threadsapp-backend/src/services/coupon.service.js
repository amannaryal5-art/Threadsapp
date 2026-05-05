const { Op } = require('sequelize');
const { Coupon, CouponUsage } = require('../models');
const ApiError = require('../utils/ApiError');

exports.validateCoupon = async ({ code, orderAmount, userId, categoryIds = [] }) => {
  const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), isActive: true } });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new ApiError(400, 'Coupon expired');
  if (Number(orderAmount) < Number(coupon.minOrderAmount)) throw new ApiError(400, 'Minimum order amount not met');
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit exceeded');

  const userUsageCount = await CouponUsage.count({ where: { couponId: coupon.id, userId } });
  if (userUsageCount >= coupon.perUserLimit) throw new ApiError(400, 'Coupon per-user limit exceeded');

  if (coupon.applicableCategories?.length) {
    const hasMatch = categoryIds.some((categoryId) => coupon.applicableCategories.includes(categoryId));
    if (!hasMatch) throw new ApiError(400, 'Coupon not applicable for selected products');
  }

  let discountAmount = 0;
  if (coupon.type === 'percent') {
    discountAmount = (Number(orderAmount) * Number(coupon.value)) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
    }
  } else {
    discountAmount = Number(coupon.value);
  }

  return { coupon, discountAmount: Number(discountAmount.toFixed(2)) };
};

exports.recordUsage = async ({ couponId, userId, orderId, discountApplied, transaction }) => {
  await CouponUsage.create({ couponId, userId, orderId, discountApplied }, { transaction });
  await Coupon.increment('usageCount', { by: 1, where: { id: couponId }, transaction });
};

exports.listActiveCoupons = async () =>
  Coupon.findAll({
    where: {
      isActive: true,
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gte]: new Date() } }],
    },
  });
