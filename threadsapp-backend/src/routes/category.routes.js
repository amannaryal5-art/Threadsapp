const router = require('express').Router();
const controller = require('../controllers/category.controller');

router.get('/', controller.getCategories);
router.get('/:slug', controller.getCategoryDetail);
router.get('/:slug/products', controller.getCategoryProducts);

module.exports = router;
