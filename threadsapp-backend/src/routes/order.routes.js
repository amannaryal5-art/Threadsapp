const router = require('express').Router();
const controller = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const orderValidation = require('../validations/order.validation');

router.use(authenticate);
router.post('/', validate(orderValidation.createOrderSchema), controller.createOrder);
router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderDetail);
router.post('/:id/cancel', controller.cancelOrder);
router.get('/:id/track', controller.trackOrder);
router.get('/:id/invoice', controller.downloadInvoice);
router.post('/:id/return', validate(orderValidation.returnRequestSchema), controller.requestReturn);

module.exports = router;
