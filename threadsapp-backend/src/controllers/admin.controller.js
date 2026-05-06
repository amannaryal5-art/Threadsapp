const slugify = require('slugify');
const runtimeStore = require('../lib/runtime-store');
const {
  User,
  Category,
  Brand,
  Product,
  ProductVariant,
  ProductImage,
  Inventory,
  Order,
  OrderItem,
  Payment,
  Coupon,
  Review,
  Return,
  Banner,
  Address,
} = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');
const shippingService = require('../services/shipping.service');
const paymentService = require('../services/payment.service');

const clearProductCache = async (product) => {
  if (product?.slug) await runtimeStore.del(`product:${product.slug}`);
};

exports.dashboard = asyncHandler(async (_req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const [orders, revenue, newUsers, lowStockAlerts] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Payment.aggregate([{ $match: { status: 'paid', createdAt: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Inventory.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }),
  ]);
  return ApiResponse.success(res, 'Dashboard fetched successfully', { todayOrders: orders, todayRevenue: Number(revenue?.[0]?.total || 0), newUsers, lowStockAlerts });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit);
  const where = req.query.search ? { $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }, { phone: { $regex: req.query.search, $options: 'i' } }] } : {};
  const [users, count] = await Promise.all([User.find(where).sort({ createdAt: -1 }).skip(offset).limit(limit), User.countDocuments(where)]);
  return ApiResponse.success(res, 'Users fetched successfully', { users }, { page, limit, total: count, totalPages: Math.ceil(count / limit) });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  return ApiResponse.success(res, 'User fetched successfully', { user });
});

exports.blockUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isActive = !user.isActive;
  await user.save();
  return ApiResponse.success(res, 'User status updated successfully', { user });
});

exports.getAdminProducts = asyncHandler(async (_req, res) => {
  const products = await Product.findAll({ include: [{ model: ProductVariant, as: 'variants', include: [{ model: Inventory, as: 'inventory' }] }, { model: ProductImage, as: 'images' }] });
  return ApiResponse.success(res, 'Products fetched successfully', { products });
});

exports.createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      slug: req.body.slug || slugify(req.body.name, { lower: true, strict: true }),
    });
    for (const variant of req.body.variants || []) {
      const createdVariant = await ProductVariant.create({ ...variant, productId: product.id });
      await Inventory.create({ variantId: createdVariant.id, quantity: variant.quantity, lowStockThreshold: variant.lowStockThreshold });
    }
    return ApiResponse.success(res, 'Product created successfully', { product }, undefined, 201);
  } catch (error) {
    throw error;
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.update({ ...req.body, slug: req.body.slug || product.slug });
  await clearProductCache(product);
  return ApiResponse.success(res, 'Product updated successfully', { product });
});

exports.deactivateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  product.isActive = false;
  await product.save();
  await clearProductCache(product);
  return ApiResponse.success(res, 'Product deactivated successfully', { product });
});

exports.uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  const files = req.files || [];
  const images = await Promise.all(
    files.slice(0, 6).map((file, index) =>
      ProductImage.create({
        productId: product.id,
        url: file.path,
        altText: file.originalname,
        isPrimary: index === 0,
        displayOrder: index,
      }),
    ),
  );
  await clearProductCache(product);
  return ApiResponse.success(res, 'Product images uploaded successfully', { images }, undefined, 201);
});

exports.deleteProductImage = asyncHandler(async (req, res) => {
  const image = await ProductImage.findOne({ where: { id: req.params.imageId, productId: req.params.id } });
  if (!image) throw new ApiError(404, 'Image not found');
  await image.destroy();
  return ApiResponse.success(res, 'Product image deleted successfully', {});
});

exports.toggleFeatured = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  product.isFeatured = !product.isFeatured;
  await product.save();
  await clearProductCache(product);
  return ApiResponse.success(res, 'Featured status updated successfully', { product });
});

exports.addVariant = asyncHandler(async (req, res) => {
  const variant = await ProductVariant.create({ ...req.body, productId: req.params.id });
  await Inventory.create({ variantId: variant.id, quantity: req.body.quantity, lowStockThreshold: req.body.lowStockThreshold });
  return ApiResponse.success(res, 'Variant added successfully', { variant }, undefined, 201);
});

exports.updateVariant = asyncHandler(async (req, res) => {
  const variant = await ProductVariant.findOne({ where: { id: req.params.variantId, productId: req.params.id } });
  if (!variant) throw new ApiError(404, 'Variant not found');
  await variant.update(req.body);
  return ApiResponse.success(res, 'Variant updated successfully', { variant });
});

exports.deleteVariant = asyncHandler(async (req, res) => {
  await Inventory.destroy({ where: { variantId: req.params.variantId } });
  await ProductVariant.destroy({ where: { id: req.params.variantId, productId: req.params.id } });
  return ApiResponse.success(res, 'Variant deleted successfully', {});
});

exports.updateInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findOne({ where: { variantId: req.params.variantId } });
  if (!inventory) throw new ApiError(404, 'Inventory not found');
  await inventory.update({ quantity: req.body.quantity, lowStockThreshold: req.body.lowStockThreshold ?? inventory.lowStockThreshold });
  return ApiResponse.success(res, 'Inventory updated successfully', { inventory });
});

exports.getAdminCategories = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Categories fetched successfully', { categories: await Category.findAll({ order: [['displayOrder', 'ASC']] }) }));
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, slug: req.body.slug || slugify(req.body.name, { lower: true, strict: true }) });
  await runtimeStore.del('categories:tree');
  return ApiResponse.success(res, 'Category created successfully', { category }, undefined, 201);
});
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  await category.update(req.body);
  await runtimeStore.del('categories:tree');
  return ApiResponse.success(res, 'Category updated successfully', { category });
});
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  category.isActive = false;
  await category.save();
  await runtimeStore.del('categories:tree');
  return ApiResponse.success(res, 'Category deleted successfully', {});
});

exports.getAdminBrands = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Brands fetched successfully', { brands: await Brand.findAll() }));
exports.createBrand = asyncHandler(async (req, res) => ApiResponse.success(res, 'Brand created successfully', { brand: await Brand.create({ ...req.body, slug: req.body.slug || slugify(req.body.name, { lower: true, strict: true }) }) }, undefined, 201));
exports.updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if (!brand) throw new ApiError(404, 'Brand not found');
  await brand.update(req.body);
  return ApiResponse.success(res, 'Brand updated successfully', { brand });
});
exports.deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if (!brand) throw new ApiError(404, 'Brand not found');
  brand.isActive = false;
  await brand.save();
  return ApiResponse.success(res, 'Brand deleted successfully', {});
});

exports.getAdminOrders = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.search) where.orderNumber = { $regex: req.query.search, $options: 'i' };
  if (req.query.startDate && req.query.endDate) where.createdAt = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
  const orders = await Order.findAll({ where, include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }, { model: User }] });
  return ApiResponse.success(res, 'Orders fetched successfully', { orders });
});

exports.getAdminOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }, { model: User }, { model: Address }] });
  if (!order) throw new ApiError(404, 'Order not found');
  return ApiResponse.success(res, 'Order fetched successfully', { order });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.status = req.body.status;
  await order.save();
  return ApiResponse.success(res, 'Order status updated successfully', { order });
});

exports.shipOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'items' }, { model: User }, { model: Address }] });
  if (!order) throw new ApiError(404, 'Order not found');
  const shipment = await shippingService.createOrder(order);
  order.shiprocketOrderId = String(shipment?.order_id || order.shiprocketOrderId || '');
  order.shiprocketShipmentId = String(shipment?.shipment_id || order.shiprocketShipmentId || '');
  if (order.shiprocketShipmentId) {
    const courier = await shippingService.assignCourier(order.shiprocketShipmentId);
    order.trackingNumber = courier?.response?.data?.awb_code || order.trackingNumber;
    order.courierName = courier?.response?.data?.courier_name || order.courierName;
    order.trackingUrl = courier?.response?.data?.tracking_url || order.trackingUrl;
  }
  order.status = 'shipped';
  await order.save();
  return ApiResponse.success(res, 'Shipment created successfully', { order, shipment });
});

exports.markDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.status = 'delivered';
  order.deliveredAt = new Date();
  await order.save();
  return ApiResponse.success(res, 'Order marked delivered successfully', { order });
});

exports.getReturns = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Returns fetched successfully', { returns: await Return.findAll({ include: [Order, OrderItem, User] }) }));
exports.getReturnById = asyncHandler(async (req, res) => {
  const itemReturn = await Return.findByPk(req.params.id, { include: [Order, OrderItem, User] });
  if (!itemReturn) throw new ApiError(404, 'Return not found');
  return ApiResponse.success(res, 'Return fetched successfully', { return: itemReturn });
});
exports.approveReturn = asyncHandler(async (req, res) => {
  const itemReturn = await Return.findByPk(req.params.id, { include: [Order] });
  if (!itemReturn) throw new ApiError(404, 'Return not found');
  itemReturn.status = 'approved';
  const pickup = itemReturn.Order.shiprocketShipmentId ? await shippingService.schedulePickup(itemReturn.Order.shiprocketShipmentId) : null;
  if (pickup) itemReturn.status = 'pickup_scheduled';
  await itemReturn.save();
  return ApiResponse.success(res, 'Return approved successfully', { return: itemReturn, pickup });
});
exports.rejectReturn = asyncHandler(async (req, res) => {
  const itemReturn = await Return.findByPk(req.params.id);
  if (!itemReturn) throw new ApiError(404, 'Return not found');
  itemReturn.status = 'rejected';
  itemReturn.adminNotes = req.body.adminNotes;
  await itemReturn.save();
  return ApiResponse.success(res, 'Return rejected successfully', { return: itemReturn });
});
exports.refundReturn = asyncHandler(async (req, res) => {
  const itemReturn = await Return.findByPk(req.params.id, { include: [{ model: Order, include: [{ model: Payment, as: 'payment' }] }] });
  if (!itemReturn) throw new ApiError(404, 'Return not found');
  const refund = await paymentService.createRefund({ paymentId: itemReturn.Order.payment?.razorpayPaymentId, amount: itemReturn.refundAmount, notes: { returnId: itemReturn.id } });
  itemReturn.status = 'refund_initiated';
  await itemReturn.save();
  return ApiResponse.success(res, 'Refund initiated successfully', { return: itemReturn, refund });
});

exports.getCoupons = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Coupons fetched successfully', { coupons: await Coupon.findAll() }));
exports.createCoupon = asyncHandler(async (req, res) => ApiResponse.success(res, 'Coupon created successfully', { coupon: await Coupon.create(req.body) }, undefined, 201));
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  await coupon.update(req.body);
  return ApiResponse.success(res, 'Coupon updated successfully', { coupon });
});
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  await coupon.destroy();
  return ApiResponse.success(res, 'Coupon deleted successfully', {});
});

exports.getAdminBanners = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Banners fetched successfully', { banners: await Banner.findAll({ order: [['displayOrder', 'ASC']] }) }));
exports.createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  await runtimeStore.del('banners:active');
  return ApiResponse.success(res, 'Banner created successfully', { banner }, undefined, 201);
});
exports.updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  await banner.update(req.body);
  await runtimeStore.del('banners:active');
  return ApiResponse.success(res, 'Banner updated successfully', { banner });
});
exports.deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  await banner.destroy();
  await runtimeStore.del('banners:active');
  return ApiResponse.success(res, 'Banner deleted successfully', {});
});

exports.getReviews = asyncHandler(async (_req, res) => ApiResponse.success(res, 'Reviews fetched successfully', { reviews: await Review.findAll({ include: [User, Product] }) }));
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  await review.destroy();
  return ApiResponse.success(res, 'Review removed successfully', {});
});

exports.analyticsRevenue = asyncHandler(async (_req, res) => {
  const rows = await Payment.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$amount' } } },
    { $sort: { _id: 1 } },
  ]);
  return ApiResponse.success(res, 'Revenue analytics fetched successfully', { rows });
});
exports.analyticsTopProducts = asyncHandler(async (_req, res) => {
  const rows = await Product.findAll({ order: [['totalSold', 'DESC']], limit: 10 });
  return ApiResponse.success(res, 'Top products fetched successfully', { rows });
});
exports.analyticsTopCategories = asyncHandler(async (_req, res) => {
  const rows = await Product.aggregate([{ $group: { _id: '$categoryId', productCount: { $sum: 1 } } }, { $sort: { productCount: -1 } }, { $limit: 10 }]);
  const categories = await Category.find({ _id: { $in: rows.map((r) => r._id) } }).lean();
  const formattedRows = rows.map((row) => ({ id: row._id, name: categories.find((c) => String(c._id) === String(row._id))?.name || 'Uncategorized', productCount: Number(row.productCount || 0) }));

  return ApiResponse.success(res, 'Top categories fetched successfully', { rows: formattedRows });
});
exports.analyticsOrdersByStatus = asyncHandler(async (_req, res) => {
  const rows = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  return ApiResponse.success(res, 'Orders by status fetched successfully', { rows });
});
