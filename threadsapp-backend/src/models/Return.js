const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reason: { type: String, enum: ['wrong_size', 'wrong_item', 'damaged', 'not_as_described', 'changed_mind'], required: true },
    description: String,
    photos: { type: [String], default: [] },
    status: { type: String, enum: ['requested', 'approved', 'rejected', 'pickup_scheduled', 'picked', 'refund_initiated', 'refunded'], default: 'requested' },
    refundAmount: Number,
    adminNotes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.models.Return || mongoose.model('Return', returnSchema);
