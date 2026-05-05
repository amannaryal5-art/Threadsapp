const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.delete('/account', controller.deleteAccount);
router.get('/notifications', controller.getNotifications);
router.put('/notifications/:id/read', controller.markNotificationRead);
router.put('/notifications/read-all', controller.markAllNotificationsRead);
router.put('/fcm-token', controller.updateFcmToken);
router.get('/loyalty-points', controller.getLoyaltyPoints);

module.exports = router;
