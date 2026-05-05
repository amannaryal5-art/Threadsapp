const { sequelize, Wishlist, Product, ProductImage } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.findAll({ where: { userId: req.user.id }, include: [{ model: Product, include: [{ model: ProductImage, as: 'images' }] }] });
  return ApiResponse.success(res, 'Wishlist fetched successfully', { items });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const existing = await Wishlist.findOne({ where: { userId: req.user.id, productId: req.body.productId }, transaction });
    let action = 'removed';
    if (existing) {
      await existing.destroy({ transaction });
    } else {
      await Wishlist.create({ userId: req.user.id, productId: req.body.productId }, { transaction });
      action = 'added';
    }
    await transaction.commit();
    return ApiResponse.success(res, `Wishlist item ${action} successfully`, { action });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
