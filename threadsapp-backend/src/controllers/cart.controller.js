const { sequelize, Cart, CartItem, Product, ProductVariant, ProductImage, Inventory } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getOrCreateCart = async (userId, transaction) => {
  let cart = await Cart.findOne({ where: { userId }, transaction });
  if (!cart) cart = await Cart.create({ userId }, { transaction });
  return cart;
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      { model: Product, include: [{ model: ProductImage, as: 'images' }] },
      { model: ProductVariant, include: [{ model: Inventory, as: 'inventory' }] },
    ],
  });

  const subtotal = items.reduce((sum, item) => sum + Number(item.priceAtAdd) * item.quantity, 0);
  return ApiResponse.success(res, 'Cart fetched successfully', { cart, items, subtotal: Number(subtotal.toFixed(2)), itemCount: items.reduce((sum, item) => sum + item.quantity, 0) });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const cart = await getOrCreateCart(req.user.id, transaction);
    const variant = await ProductVariant.findOne({ where: { id: req.body.variantId, productId: req.body.productId }, include: [{ model: Inventory, as: 'inventory' }], transaction });
    if (!variant || !variant.inventory || variant.inventory.quantity < req.body.quantity) throw new ApiError(400, 'Out of stock');
    const product = await Product.findByPk(req.body.productId, { transaction });
    const priceAtAdd = Number(product.sellingPrice) + Number(variant.additionalPrice);
    const existing = await CartItem.findOne({ where: { cartId: cart.id, productId: req.body.productId, variantId: req.body.variantId }, transaction });
    if (existing) {
      existing.quantity += req.body.quantity;
      existing.priceAtAdd = priceAtAdd;
      await existing.save({ transaction });
    } else {
      await CartItem.create({ cartId: cart.id, productId: req.body.productId, variantId: req.body.variantId, quantity: req.body.quantity, priceAtAdd }, { transaction });
    }
    await transaction.commit();
    return ApiResponse.success(res, 'Item added to cart successfully', {});
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findByPk(req.params.itemId, { include: [{ model: Cart }] });
  if (!item || item.Cart.userId !== req.user.id) throw new ApiError(404, 'Cart item not found');
  item.quantity = req.body.quantity;
  await item.save();
  return ApiResponse.success(res, 'Cart item updated successfully', { item });
});

exports.removeCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findByPk(req.params.itemId, { include: [{ model: Cart }] });
  if (!item || item.Cart.userId !== req.user.id) throw new ApiError(404, 'Cart item not found');
  await item.destroy();
  return ApiResponse.success(res, 'Cart item removed successfully', {});
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await CartItem.destroy({ where: { cartId: cart.id } });
  return ApiResponse.success(res, 'Cart cleared successfully', {});
});
