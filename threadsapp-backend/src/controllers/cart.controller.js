const { Cart, CartItem, Product, ProductVariant, ProductImage, Inventory } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId });
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
  try {
    const cart = await getOrCreateCart(req.user.id);
    const variant = await ProductVariant.findOne({ _id: req.body.variantId, productId: req.body.productId });
    const variantInventory = variant ? await Inventory.findOne({ variantId: variant._id }) : null;
    if (!variant || !variantInventory || variantInventory.quantity < req.body.quantity) throw new ApiError(400, 'Out of stock');
    const product = await Product.findById(req.body.productId);
    const priceAtAdd = Number(product.sellingPrice) + Number(variant.additionalPrice);
    const existing = await CartItem.findOne({ cartId: cart.id, productId: req.body.productId, variantId: req.body.variantId });
    if (existing) {
      existing.quantity += req.body.quantity;
      existing.priceAtAdd = priceAtAdd;
      await existing.save();
    } else {
      await CartItem.create({ cartId: cart.id, productId: req.body.productId, variantId: req.body.variantId, quantity: req.body.quantity, priceAtAdd });
    }
    return ApiResponse.success(res, 'Item added to cart successfully', {});
  } catch (error) {
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
