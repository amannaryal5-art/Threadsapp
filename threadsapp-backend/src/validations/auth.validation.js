const Joi = require('joi');

exports.sendOtpSchema = Joi.object({
  phone: Joi.string().required(),
});

exports.sendEmailOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().allow('', null),
});

exports.verifyOtpSchema = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string().length(6).required(),
});

exports.registerSchema = Joi.object({
  phone: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  emailOtp: Joi.string().length(6).required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').default('prefer_not_to_say'),
});

exports.loginSchema = Joi.object({
  phone: Joi.string(),
  otp: Joi.string().length(6),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).or('phone', 'email');

exports.adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

exports.resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
