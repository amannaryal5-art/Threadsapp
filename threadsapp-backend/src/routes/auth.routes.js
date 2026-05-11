const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const authValidation = require('../validations/auth.validation');

router.post('/send-otp', validate(authValidation.sendOtpSchema), controller.sendOtp);
router.post('/send-email-otp', validate(authValidation.sendEmailOtpSchema), controller.sendEmailOtp);
router.post('/verify-otp', validate(authValidation.verifyOtpSchema), controller.verifyOtp);
router.post('/register', validate(authValidation.registerSchema), controller.register);
router.post('/login', validate(authValidation.loginSchema), controller.login);
router.post('/admin/login', validate(authValidation.adminLoginSchema), controller.adminLogin);
router.post('/refresh-token', validate(authValidation.refreshTokenSchema), controller.refreshToken);
router.post('/logout', controller.logout);
router.post('/forgot-password', validate(authValidation.forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPasswordSchema), controller.resetPassword);
router.post('/change-password', authenticate, validate(authValidation.changePasswordSchema), controller.changePassword);

module.exports = router;
