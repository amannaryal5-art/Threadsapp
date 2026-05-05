const router = require('express').Router();
const controller = require('../controllers/banner.controller');

router.get('/', controller.getBanners);

module.exports = router;
