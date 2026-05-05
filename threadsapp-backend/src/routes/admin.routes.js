const router = require('express').Router();
const controller = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const notificationController = require('../controllers/notification.controller');
const { productSchema, variantSchema } = require('../validations/product.validation');
const { couponSchema } = require('../validations/coupon.validation');

router.use(authenticate, role('admin'));

router.get('/dashboard', controller.dashboard);
router.get('/users', controller.getUsers);
router.get('/users/:id', controller.getUserById);
router.put('/users/:id/block', controller.blockUser);

router.get('/products', controller.getAdminProducts);
router.post('/products', validate(productSchema), controller.createProduct);
router.put('/products/:id', controller.updateProduct);
router.delete('/products/:id', controller.deactivateProduct);
router.post('/products/:id/images', upload.array('images', 6), controller.uploadProductImages);
router.delete('/products/:id/images/:imageId', controller.deleteProductImage);
router.put('/products/:id/featured', controller.toggleFeatured);
router.post('/products/:id/variants', validate(variantSchema), controller.addVariant);
router.put('/products/:id/variants/:variantId', controller.updateVariant);
router.delete('/products/:id/variants/:variantId', controller.deleteVariant);
router.put('/inventory/:variantId', controller.updateInventory);

router.get('/categories', controller.getAdminCategories);
router.post('/categories', controller.createCategory);
router.put('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);

router.get('/brands', controller.getAdminBrands);
router.post('/brands', controller.createBrand);
router.put('/brands/:id', controller.updateBrand);
router.delete('/brands/:id', controller.deleteBrand);

router.get('/orders', controller.getAdminOrders);
router.get('/orders/:id', controller.getAdminOrderById);
router.put('/orders/:id/status', controller.updateOrderStatus);
router.post('/orders/:id/ship', controller.shipOrder);
router.put('/orders/:id/deliver', controller.markDelivered);

router.get('/returns', controller.getReturns);
router.get('/returns/:id', controller.getReturnById);
router.put('/returns/:id/approve', controller.approveReturn);
router.put('/returns/:id/reject', controller.rejectReturn);
router.put('/returns/:id/refund', controller.refundReturn);

router.get('/coupons', controller.getCoupons);
router.post('/coupons', validate(couponSchema), controller.createCoupon);
router.put('/coupons/:id', controller.updateCoupon);
router.delete('/coupons/:id', controller.deleteCoupon);

router.get('/banners', controller.getAdminBanners);
router.post('/banners', controller.createBanner);
router.put('/banners/:id', controller.updateBanner);
router.delete('/banners/:id', controller.deleteBanner);

router.get('/reviews', controller.getReviews);
router.delete('/reviews/:id', controller.deleteReview);

router.get('/analytics/revenue', controller.analyticsRevenue);
router.get('/analytics/top-products', controller.analyticsTopProducts);
router.get('/analytics/top-categories', controller.analyticsTopCategories);
router.get('/analytics/orders-by-status', controller.analyticsOrdersByStatus);
router.post('/notifications/broadcast', notificationController.broadcast);

module.exports = router;
