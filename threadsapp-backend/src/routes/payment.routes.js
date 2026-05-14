const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/webhook', controller.webhook);
router.post('/create-order', authenticate, controller.createOrder);
router.post('/verify', authenticate, controller.verifyPayment);
router.post('/:orderId/sync', authenticate, controller.syncPayment);
router.post('/:orderId/cod', authenticate, controller.markCod);

module.exports = router;
