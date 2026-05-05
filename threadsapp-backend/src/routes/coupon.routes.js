const router = require('express').Router();
const controller = require('../controllers/coupon.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const couponValidation = require('../validations/coupon.validation');

router.use(authenticate);
router.post('/apply', validate(couponValidation.applyCouponSchema), controller.applyCoupon);
router.delete('/remove', controller.removeCoupon);

module.exports = router;
