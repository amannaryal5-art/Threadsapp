const router = require('express').Router();
const controller = require('../controllers/search.controller');

router.get('/', controller.search);
router.get('/suggestions', controller.suggestions);
router.get('/trending', controller.trending);

module.exports = router;
