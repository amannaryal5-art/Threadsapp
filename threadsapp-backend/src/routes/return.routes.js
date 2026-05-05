const router = require('express').Router();
const controller = require('../controllers/return.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', controller.getMyReturns);
router.get('/:id', controller.getReturnDetail);

module.exports = router;
