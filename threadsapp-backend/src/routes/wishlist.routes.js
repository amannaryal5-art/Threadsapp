const router = require('express').Router();
const controller = require('../controllers/wishlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', controller.getWishlist);
router.post('/toggle', controller.toggleWishlist);

module.exports = router;
