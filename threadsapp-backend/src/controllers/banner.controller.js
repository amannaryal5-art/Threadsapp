const runtimeStore = require('../lib/runtime-store');
const { Banner } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getBanners = asyncHandler(async (_req, res) => {
  const cached = await runtimeStore.get('banners:active');
  if (cached) return ApiResponse.success(res, 'Banners fetched successfully', { banners: JSON.parse(cached) });
  const now = new Date();
  const banners = await Banner.find({
    isActive: true,
    $and: [{ $or: [{ startsAt: null }, { startsAt: { $lte: now } }] }, { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] }],
  }).sort({ displayOrder: 1 });
  await runtimeStore.set('banners:active', JSON.stringify(banners), 'EX', 1800);
  return ApiResponse.success(res, 'Banners fetched successfully', { banners });
});
