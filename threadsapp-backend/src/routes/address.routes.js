const router = require('express').Router();
const controller = require('../controllers/address.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', controller.getAddresses);
router.post('/', controller.createAddress);
router.put('/:id', controller.updateAddress);
router.delete('/:id', controller.deleteAddress);
router.put('/:id/default', controller.setDefaultAddress);

module.exports = router;
