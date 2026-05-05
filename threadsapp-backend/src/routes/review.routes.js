const router = require('express').Router();
const controller = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { reviewSchema } = require('../validations/review.validation');

router.use(authenticate);
router.post('/', validate(reviewSchema), controller.createReview);
router.put('/:id', controller.updateReview);
router.delete('/:id', controller.deleteReview);
router.post('/:id/helpful', controller.markHelpful);

module.exports = router;
