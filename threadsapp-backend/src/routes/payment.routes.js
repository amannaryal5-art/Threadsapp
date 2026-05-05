const router = require('express').Router();
const controller = require('../controllers/payment.controller');

router.post('/create-order', controller.createOrder);
router.post('/verify', controller.verifyPayment);
router.post('/webhook', controller.webhook);
router.post('/:orderId/cod', controller.markCod);

module.exports = router;
