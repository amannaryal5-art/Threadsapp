const router = require('express').Router();
const controller = require('../controllers/product.controller');

router.get('/', controller.getProducts);
router.get('/featured', controller.getFeaturedProducts);
router.get('/new-arrivals', controller.getNewArrivals);
router.get('/trending', controller.getTrendingProducts);
router.get('/deals', controller.getDeals);
router.get('/:slug', controller.getProductDetail);
router.get('/:slug/reviews', controller.getProductReviews);
router.get('/:slug/similar', controller.getSimilarProducts);

module.exports = router;
