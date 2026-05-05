const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/addresses', require('./address.routes'));
router.use('/categories', require('./category.routes'));
router.use('/brands', require('./brand.routes'));
router.use('/products', require('./product.routes'));
router.use('/cart', require('./cart.routes'));
router.use('/wishlist', require('./wishlist.routes'));
router.use('/orders', require('./order.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/coupons', require('./coupon.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/search', require('./search.routes'));
router.use('/banners', require('./banner.routes'));
router.use('/returns', require('./return.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
