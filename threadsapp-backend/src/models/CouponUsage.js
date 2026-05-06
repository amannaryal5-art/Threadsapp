const mongoose = require('mongoose');

const couponUsageSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    discountApplied: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.CouponUsage || mongoose.model('CouponUsage', couponUsageSchema);
