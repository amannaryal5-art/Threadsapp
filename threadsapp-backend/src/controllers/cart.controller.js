const { Cart, CartItem, Product, ProductVariant, ProductImage, Inventory } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeProduct } = require('../utils/product-media');
const { roundCurrency, getVariantMrp, getVariantSellingPrice } = require('../utils/pricing');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
};

const getCurrentCartUnitPrice = (product, variant) => getVariantSellingPrice(product, variant);
const getCurrentCartMrp = (product, variant) => getVariantMrp(product, variant);

const buildCartPricingSummary = (items, couponDiscount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.priceAtAdd) * item.quantity, 0);
  const mrpTotal = items.reduce((sum, item) => sum + getCurrentCartMrp(item.Product, item.ProductVariant) * item.quantity, 0);
  const normalizedCouponDiscount = Math.max(Number(couponDiscount || 0), 0);
  const shippingCharge = subtotal >= Number(process.env.FREE_SHIPPING_THRESHOLD || 499) ? 0 : 49;
  const taxableAmount = Math.max(subtotal - normalizedCouponDiscount, 0) + shippingCharge;
  const taxAmount = taxableAmount * Number(process.env.GST_RATE || 0.18);
  const totalAmount = taxableAmount + taxAmount;

  return {
    subtotal: roundCurrency(subtotal),
    mrpTotal: roundCurrency(mrpTotal),
    productDiscount: roundCurrency(Math.max(mrpTotal - subtotal, 0)),
    couponDiscount: roundCurrency(normalizedCouponDiscount),
    shippingCharge: roundCurrency(shippingCharge),
    taxAmount: roundCurrency(taxAmount),
    totalAmount: roundCurrency(totalAmount),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
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
  const normalizedItems = [];
  for (const item of items) {
    const currentUnitPrice = getCurrentCartUnitPrice(item.Product, item.ProductVariant);
    if (Number(item.priceAtAdd) !== currentUnitPrice) {
      item.priceAtAdd = currentUnitPrice;
      await item.save();
    }
    const payload = item.toJSON();
    normalizedItems.push({
      ...payload,
      Product: normalizeProduct(payload.Product, req),
    });
  }

  const pricingSummary = buildCartPricingSummary(normalizedItems);
  return ApiResponse.success(res, 'Cart fetched successfully', {
    cart,
    items: normalizedItems,
    ...pricingSummary,
  });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity || 1);
  if (!req.body.productId || !req.body.variantId || quantity < 1) {
    throw new ApiError(400, 'Invalid cart payload');
  }

  const cart = await getOrCreateCart(req.user.id);
  const variant = await ProductVariant.findOne({ where: { id: req.body.variantId, productId: req.body.productId } });
  const variantInventory = variant ? await Inventory.findOne({ where: { variantId: variant.id } }) : null;
  if (!variant || !variantInventory || variantInventory.quantity < quantity) throw new ApiError(400, 'Out of stock');

  const product = await Product.findByPk(req.body.productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const priceAtAdd = getCurrentCartUnitPrice(product, variant);
  const existing = await CartItem.findOne({
    where: {
      cartId: cart.id,
      productId: req.body.productId,
      variantId: req.body.variantId,
    },
  });

  if (existing) {
    existing.quantity += quantity;
    existing.priceAtAdd = priceAtAdd;
    await existing.save();
  } else {
    await CartItem.create({ cartId: cart.id, productId: req.body.productId, variantId: req.body.variantId, quantity, priceAtAdd });
  }

  return ApiResponse.success(res, 'Item added to cart successfully', {});
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findByPk(req.params.itemId, { include: [{ model: Cart }] });
  if (!item || item.Cart.userId !== req.user.id) throw new ApiError(404, 'Cart item not found');
  const quantity = Number(req.body.quantity || 1);
  if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');
  const [product, variant] = await Promise.all([
    Product.findByPk(item.productId),
    ProductVariant.findByPk(item.variantId),
  ]);
  item.quantity = quantity;
  if (product && variant) {
    item.priceAtAdd = getCurrentCartUnitPrice(product, variant);
  }
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
