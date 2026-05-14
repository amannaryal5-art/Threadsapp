const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const ApiError = require('../utils/ApiError');

function assertRazorpayConfig() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, 'Razorpay is not configured on the server');
  }
}

exports.createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) =>
  (assertRazorpayConfig(),
  razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt,
    notes,
  }));

exports.verifySignature = ({ orderId, paymentId, signature }) => {
  assertRazorpayConfig();
  const digest = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return digest === signature;
};

exports.verifyWebhookSignature = ({ rawBody, signature }) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return digest === signature;
};

exports.createRefund = async ({ paymentId, amount, notes = {} }) =>
  (assertRazorpayConfig(),
  razorpay.payments.refund(paymentId, {
    amount: amount ? Math.round(Number(amount) * 100) : undefined,
    notes,
  }));

exports.fetchPaymentsForRazorpayOrder = async (razorpayOrderId) =>
  (assertRazorpayConfig(), razorpay.orders.fetchPayments(razorpayOrderId));
