const { Notification } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

exports.getProfile = asyncHandler(async (req, res) => ApiResponse.success(res, 'Profile fetched successfully', { user: req.user }));

exports.updateProfile = asyncHandler(async (req, res) => {
  Object.assign(req.user, {
    name: req.body.name ?? req.user.name,
    email: req.body.email ?? req.user.email,
    gender: req.body.gender ?? req.user.gender,
    dateOfBirth: req.body.dateOfBirth ?? req.user.dateOfBirth,
    profilePhoto: req.body.profilePhoto ?? req.user.profilePhoto,
  });
  await req.user.save();
  return ApiResponse.success(res, 'Profile updated successfully', { user: req.user });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  req.user.isActive = false;
  await req.user.save();
  return ApiResponse.success(res, 'Account deleted successfully', {});
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit);
  const { rows, count } = await Notification.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });
  return ApiResponse.success(res, 'Notifications fetched successfully', { notifications: rows }, { page, limit, total: count, totalPages: Math.ceil(count / limit) });
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  notification.isRead = true;
  await notification.save();
  return ApiResponse.success(res, 'Notification marked as read', { notification });
});

exports.markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
  return ApiResponse.success(res, 'All notifications marked as read', {});
});

exports.updateFcmToken = asyncHandler(async (req, res) => {
  req.user.fcmToken = req.body.fcmToken;
  await req.user.save();
  return ApiResponse.success(res, 'FCM token updated successfully', { fcmToken: req.user.fcmToken });
});

exports.getLoyaltyPoints = asyncHandler(async (req, res) =>
  ApiResponse.success(res, 'Loyalty points fetched successfully', {
    balance: req.user.loyaltyPoints,
    history: [{ type: 'current_balance', points: req.user.loyaltyPoints, description: 'Current loyalty balance' }],
  }),
);
