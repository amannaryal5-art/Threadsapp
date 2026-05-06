const { Wishlist, Product, ProductImage } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.findAll({ where: { userId: req.user.id }, include: [{ model: Product, include: [{ model: ProductImage, as: 'images' }] }] });
  return ApiResponse.success(res, 'Wishlist fetched successfully', { items });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const existing = await Wishlist.findOne({ userId: req.user.id, productId: req.body.productId });
  let action = 'removed';
  if (existing) {
    await existing.deleteOne();
  } else {
    await Wishlist.create({ userId: req.user.id, productId: req.body.productId });
    action = 'added';
  }
  return ApiResponse.success(res, `Wishlist item ${action} successfully`, { action });
});
