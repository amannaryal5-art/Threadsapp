const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');

router.post('/create-order', controller.createOrder);
router.post('/verify', controller.verifyPayment);
// Razorpay requires raw body for webhook signature verification.
router.post('/webhook', express.raw({ type: 'application/json' }), controller.webhook);
router.post('/:orderId/cod', controller.markCod);

module.exports = router;
