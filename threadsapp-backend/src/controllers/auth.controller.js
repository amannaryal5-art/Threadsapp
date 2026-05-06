const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const runtimeStore = require('../lib/runtime-store');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateTokens = require('../utils/generateTokens');
const otpService = require('../services/otp.service');
const emailService = require('../services/email.service');

const normalizeEmail = (email) => email?.trim().toLowerCase();

const serializeUser = (user) => {
  const plainUser = typeof user?.get === 'function' ? user.get({ plain: true }) : user;
  if (!plainUser) return plainUser;
  const { passwordHash, ...safeUser } = plainUser;
  return safeUser;
};

exports.sendOtp = asyncHandler(async (req, res) => {
  await otpService.sendOtp(req.body.phone);
  return ApiResponse.success(res, 'OTP sent successfully', { phone: req.body.phone });
});

exports.sendEmailOtp = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new ApiError(409, 'User already exists');

  const otp = await otpService.sendEmailOtp(normalizedEmail, req.body.name);
  return ApiResponse.success(res, 'Email OTP sent successfully', {
    email: normalizedEmail,
    ...(process.env.NODE_ENV !== 'production' && !emailService.isEmailConfigured() ? { previewOtp: otp } : {}),
  });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const isValid = await otpService.verifyOtp(req.body.phone, req.body.otp);
  if (!isValid) throw new ApiError(400, 'Invalid OTP');
  await runtimeStore.set(`phone_verified:${req.body.phone}`, 'true', 'EX', 15 * 60);
  return ApiResponse.success(res, 'OTP verified successfully', { verified: true });
});

exports.register = asyncHandler(async (req, res) => {
  const isVerified = await runtimeStore.get(`phone_verified:${req.body.phone}`);
  const isEmailOtpValid = await otpService.verifyEmailOtp(req.body.email, req.body.emailOtp);
  if (!isEmailOtpValid) throw new ApiError(400, 'Invalid or expired email OTP');
  // if (!isVerified) throw new ApiError(400, 'Phone number not verified');

  const normalizedEmail = normalizeEmail(req.body.email);
  const existing = await User.findOne({ $or: [{ phone: req.body.phone }, { email: normalizedEmail }] });
  if (existing) throw new ApiError(409, 'User already exists');

  const user = await User.create({
    phone: req.body.phone,
    name: req.body.name,
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(req.body.password, 10),
    gender: req.body.gender,
    isPhoneVerified: Boolean(isVerified),
    isEmailVerified: true,
  });

  const tokens = await generateTokens(user);
  return ApiResponse.success(res, 'Registration completed successfully', { user: serializeUser(user), tokens }, undefined, 201);
});

exports.login = asyncHandler(async (req, res) => {
  let user;
  if (req.body.phone && req.body.otp) {
    const valid = await otpService.verifyOtp(req.body.phone, req.body.otp);
    if (!valid) throw new ApiError(400, 'Invalid OTP');
    user = await User.findOne({ phone: req.body.phone });
  } else if (req.body.email && req.body.password) {
    user = await User.findOne({ email: normalizeEmail(req.body.email) }).select('+passwordHash');
    if (!user || !user.passwordHash || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
      throw new ApiError(401, 'Invalid email or password');
    }
  } else {
    throw new ApiError(400, 'Provide phone+OTP or email+password');
  }

  if (!user || !user.isActive) throw new ApiError(401, 'User not found or inactive');
  const tokens = await generateTokens(user);
  return ApiResponse.success(res, 'Login successful', { user: serializeUser(user), tokens });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const exists = await runtimeStore.get(`refresh:${decoded.id}:${refreshToken}`);
  if (!exists) throw new ApiError(401, 'Refresh token invalid or expired');
  const user = await User.findById(decoded.id);
  const tokens = await generateTokens(user);
  return ApiResponse.success(res, 'Token refreshed successfully', tokens);
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await runtimeStore.del(`refresh:${decoded.id}:${refreshToken}`);
  }
  return ApiResponse.success(res, 'Logout successful', {});
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: normalizeEmail(req.body.email) });
  if (!user) throw new ApiError(404, 'User not found');

  const token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
  await runtimeStore.set(`reset:${token}`, user.id, 'EX', 30 * 60);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await emailService.sendPasswordReset(user, resetLink);

  return ApiResponse.success(res, 'Password reset link sent successfully', { resetLink });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const userId = await runtimeStore.get(`reset:${req.body.token}`);
  if (!userId) throw new ApiError(400, 'Reset token expired or invalid');
  const user = await User.findById(userId).select('+passwordHash');
  user.passwordHash = await bcrypt.hash(req.body.password, 10);
  await user.save();
  await runtimeStore.del(`reset:${req.body.token}`);
  return ApiResponse.success(res, 'Password reset successfully', {});
});

exports.changePassword = asyncHandler(async (req, res) => {
  const matches = await bcrypt.compare(req.body.currentPassword, req.user.passwordHash || '');
  if (!matches) throw new ApiError(400, 'Current password is incorrect');
  req.user.passwordHash = await bcrypt.hash(req.body.newPassword, 10);
  await req.user.save();
  return ApiResponse.success(res, 'Password changed successfully', {});
});
