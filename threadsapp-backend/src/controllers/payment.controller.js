const { Order, Payment } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/payment.service');
const orderService = require('../services/order.service');

exports.createOrder = asyncHandler(async (req, res) => {
  // Supports two flows:
  // 1) Pass { orderId } to create a Razorpay order for an existing internal Order.
  // 2) Pass { amount, currency, receipt, notes } for a generic Razorpay order.
  const { orderId } = req.body || {};

  let razorpayOrder;
  if (orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new ApiError(404, 'Order not found');

    const payment = await Payment.findOne({ where: { orderId: order.id } });
    if (!payment) throw new ApiError(404, 'Payment record not found for this order');

    if (order.paymentStatus === 'paid' || payment.status === 'paid') {
      throw new ApiError(409, 'Order is already paid');
    }

    razorpayOrder = await paymentService.createRazorpayOrder({
      amount: order.totalAmount,
      currency: payment.currency || 'INR',
      receipt: order.orderNumber || String(order.id),
      notes: { orderId: order.id, orderNumber: order.orderNumber || '', userId: order.userId },
    });

    payment.razorpayOrderId = razorpayOrder.id;
    payment.status = 'pending';
    await payment.save();
  } else {
    razorpayOrder = await paymentService.createRazorpayOrder(req.body);
  }

  return ApiResponse.success(res, 'Razorpay order created successfully', { razorpayOrder });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, method } = req.body;
  const valid = paymentService.verifySignature({ orderId: razorpayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature });
  if (!valid) throw new ApiError(400, 'Invalid payment signature');
  const order = await orderService.finalizePaidOrder({ orderId, razorpayPaymentId, razorpaySignature, method });
  return ApiResponse.success(res, 'Payment verified successfully', { order });
});

exports.webhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body; // Buffer (because route uses express.raw)

  const ok = paymentService.verifyWebhookSignature({ rawBody, signature });
  if (!ok) throw new ApiError(400, 'Invalid webhook signature');

  const data = JSON.parse(rawBody.toString('utf8'));
  const event = data.event;
  const payload = data.payload || {};

  if (event === 'payment.captured') {
    const paymentEntity = payload.payment?.entity;
    const payment = await Payment.findOne({ where: { razorpayOrderId: paymentEntity.order_id } });
    if (payment) {
      await orderService.finalizePaidOrder({
        orderId: payment.orderId,
        razorpayPaymentId: paymentEntity.id,
        razorpaySignature: 'webhook',
        method: paymentEntity.method,
      });
    }
  }

  if (event === 'payment.failed') {
    const paymentEntity = payload.payment?.entity;
    await Payment.update({ status: 'failed' }, { where: { razorpayOrderId: paymentEntity?.order_id } });
  }

  if (event === 'refund.processed') {
    const refundEntity = payload.refund?.entity;
    await Payment.update({ status: 'refunded', refundId: refundEntity.id, refundAmount: refundEntity.amount / 100 }, { where: { razorpayPaymentId: refundEntity.payment_id } });
  }

  return ApiResponse.success(res, 'Webhook processed successfully', {});
});

exports.markCod = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  let payment = await Payment.findOne({ where: { orderId: order.id } });
  if (!payment) payment = await Payment.create({ orderId: order.id, userId: order.userId, amount: order.totalAmount });
  payment.method = 'cod';
  payment.status = 'pending';
  await payment.save();
  return ApiResponse.success(res, 'COD marked successfully', { payment });
});
