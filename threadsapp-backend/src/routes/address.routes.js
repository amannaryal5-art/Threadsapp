const router = require('express').Router();
const controller = require('../controllers/address.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { addressSchema } = require('../validations/address.validation');

router.use(authenticate);
router.get('/', controller.getAddresses);
router.post('/', validate(addressSchema), controller.createAddress);
router.put('/:id', validate(addressSchema), controller.updateAddress);
router.delete('/:id', controller.deleteAddress);
router.put('/:id/default', controller.setDefaultAddress);

module.exports = router;
