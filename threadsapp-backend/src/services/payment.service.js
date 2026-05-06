const crypto = require('crypto');
const razorpay = require('../config/razorpay');

exports.createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) =>
  razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt,
    notes,
  });

exports.verifySignature = ({ orderId, paymentId, signature }) => {
  const digest = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
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
  razorpay.payments.refund(paymentId, {
    amount: amount ? Math.round(Number(amount) * 100) : undefined,
    notes,
  });
