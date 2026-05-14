const { Wishlist, Product, ProductImage } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeProduct } = require('../utils/product-media');

exports.getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.findAll({ where: { userId: req.user.id }, include: [{ model: Product, include: [{ model: ProductImage, as: 'images' }] }] });
  const normalizedItems = items.map((item) => {
    const payload = item.toJSON();
    return {
      ...payload,
      Product: normalizeProduct(payload.Product, req),
    };
  });
  return ApiResponse.success(res, 'Wishlist fetched successfully', { items: normalizedItems });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const existing = await Wishlist.findOne({ where: { userId: req.user.id, productId: req.body.productId } });
  let action = 'removed';
  if (existing) {
    await existing.destroy();
  } else {
    await Wishlist.create({ userId: req.user.id, productId: req.body.productId });
    action = 'added';
  }
  return ApiResponse.success(res, `Wishlist item ${action} successfully`, { action });
});
