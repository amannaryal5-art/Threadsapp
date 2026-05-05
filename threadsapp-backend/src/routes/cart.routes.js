const router = require('express').Router();
const controller = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', controller.getCart);
router.post('/add', controller.addToCart);
router.put('/item/:itemId', controller.updateCartItem);
router.delete('/item/:itemId', controller.removeCartItem);
router.delete('/clear', controller.clearCart);

module.exports = router;
