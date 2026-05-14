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
    if (String(order.userId) !== String(req.user.id)) throw new ApiError(403, 'You are not allowed to pay for this order');

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
  const order = await Order.findByPk(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (String(order.userId) !== String(req.user.id)) throw new ApiError(403, 'You are not allowed to verify payment for this order');
  const valid = paymentService.verifySignature({ orderId: razorpayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature });
  if (!valid) throw new ApiError(400, 'Invalid payment signature');
  const finalizedOrder = await orderService.finalizePaidOrder({ orderId, razorpayPaymentId, razorpaySignature, method });
  return ApiResponse.success(res, 'Payment verified successfully', { order: finalizedOrder });
});

exports.syncPayment = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.orderId, { include: [{ model: Payment, as: 'payment' }] });
  if (!order) throw new ApiError(404, 'Order not found');
  if (String(order.userId) !== String(req.user.id)) throw new ApiError(403, 'You are not allowed to sync payment for this order');

  if (order.paymentStatus === 'paid') {
    return ApiResponse.success(res, 'Payment already synced', { order, paymentStatus: 'paid' });
  }

  const razorpayOrderId = order.payment?.razorpayOrderId;
  if (!razorpayOrderId) {
    throw new ApiError(400, 'Razorpay order is not available for this payment');
  }

  const paymentsResponse = await paymentService.fetchPaymentsForRazorpayOrder(razorpayOrderId);
  const payments = paymentsResponse?.items || paymentsResponse?.payments || [];
  const capturedPayment = payments.find((item) => item.status === 'captured' || item.captured === true);

  if (capturedPayment) {
    const finalizedOrder = await orderService.finalizePaidOrder({
      orderId: order.id,
      razorpayPaymentId: capturedPayment.id,
      razorpaySignature: 'sync',
      method: capturedPayment.method || order.payment?.method || 'upi',
    });

    return ApiResponse.success(res, 'Payment synced successfully', { order: finalizedOrder, paymentStatus: 'paid' });
  }

  const failedPayment = payments.find((item) => item.status === 'failed');
  if (failedPayment && order.payment) {
    order.payment.status = 'failed';
    order.payment.razorpayPaymentId = failedPayment.id;
    order.payment.method = failedPayment.method || order.payment.method;
    await order.payment.save();
  }

  return ApiResponse.success(res, 'Payment is still pending', { order, paymentStatus: 'pending' });
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
  if (String(order.userId) !== String(req.user.id)) throw new ApiError(403, 'You are not allowed to update payment for this order');
  let payment = await Payment.findOne({ where: { orderId: order.id } });
  if (!payment) payment = await Payment.create({ orderId: order.id, userId: order.userId, amount: order.totalAmount });
  payment.method = 'cod';
  payment.status = 'pending';
  await payment.save();
  return ApiResponse.success(res, 'COD marked successfully', { payment });
});
