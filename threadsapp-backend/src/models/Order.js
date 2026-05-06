const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: { type: String, enum: ['pending_payment', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'return_picked', 'refunded'], default: 'pending_payment' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    shiprocketOrderId: String,
    shiprocketShipmentId: String,
    trackingNumber: String,
    courierName: String,
    trackingUrl: String,
    estimatedDelivery: String,
    deliveredAt: Date,
    notes: String,
    invoiceUrl: String,
  },
  { timestamps: true },
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
