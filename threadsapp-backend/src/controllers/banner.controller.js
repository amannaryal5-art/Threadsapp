const { Op } = require('sequelize');
const runtimeStore = require('../lib/runtime-store');
const { Banner } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getBanners = asyncHandler(async (_req, res) => {
  const cached = await runtimeStore.get('banners:active');
  if (cached) return ApiResponse.success(res, 'Banners fetched successfully', { banners: JSON.parse(cached) });
  const now = new Date();
  const banners = await Banner.findAll({
    where: {
      isActive: true,
      [Op.or]: [{ startsAt: null }, { startsAt: { [Op.lte]: now } }],
      [Op.and]: [{ [Op.or]: [{ endsAt: null }, { endsAt: { [Op.gte]: now } }] }],
    },
    order: [['displayOrder', 'ASC']],
  });
  await runtimeStore.set('banners:active', JSON.stringify(banners), 'EX', 1800);
  return ApiResponse.success(res, 'Banners fetched successfully', { banners });
});
