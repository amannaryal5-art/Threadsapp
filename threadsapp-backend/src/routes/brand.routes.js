const router = require('express').Router();
const controller = require('../controllers/brand.controller');

router.get('/', controller.getBrands);
router.get('/:slug/products', controller.getBrandProducts);

module.exports = router;
