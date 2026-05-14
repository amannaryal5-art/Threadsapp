const { Order, OrderItem, Payment, Address, Return, User } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');
const orderService = require('../services/order.service');
const shippingService = require('../services/shipping.service');
const invoiceService = require('../services/invoice.service');

exports.createOrder = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder({ userId: req.user.id, ...req.body });
  return ApiResponse.success(res, 'Order created successfully', result, undefined, 201);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit);
  const where = { userId: req.user.id };
  if (req.query.status) where.status = req.query.status;
  const [orders, count] = await Promise.all([
    Order.findAll({
      where,
      include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }, { model: Address }],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    }),
    Order.count({ where }),
  ]);
  return ApiResponse.success(res, 'Orders fetched successfully', { orders }, { page, limit, total: count, totalPages: Math.ceil(count / limit) });
});

exports.getOrderDetail = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }, { model: Address }],
  });
  if (!order) throw new ApiError(404, 'Order not found');
  return ApiResponse.success(res, 'Order fetched successfully', { order });
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!order) throw new ApiError(404, 'Order not found');
  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.status)) throw new ApiError(400, 'Order can no longer be cancelled');
  order.status = 'cancelled';
  order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus;
  await order.save();
  return ApiResponse.success(res, 'Order cancelled successfully', { order });
});

exports.trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!order) throw new ApiError(404, 'Order not found');
  const tracking = order.shiprocketShipmentId ? await shippingService.getTracking(order.shiprocketShipmentId) : null;
  return ApiResponse.success(res, 'Tracking fetched successfully', { order, tracking });
});

exports.downloadInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ model: OrderItem, as: 'items' }, { model: Payment, as: 'payment' }, { model: User }, { model: Address }],
  });
  if (!order) throw new ApiError(404, 'Order not found');
  if (!order.invoiceUrl) {
    order.invoiceUrl = await invoiceService.generateInvoice(order);
    await order.save();
  }
  return ApiResponse.success(res, 'Invoice generated successfully', { invoiceUrl: order.invoiceUrl });
});

exports.requestReturn = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id, status: 'delivered' } });
  if (!order) throw new ApiError(400, 'Only delivered orders can be returned');
  const orderItem = await OrderItem.findOne({ where: { id: req.body.orderItemId, orderId: order.id } });
  if (!orderItem) throw new ApiError(404, 'Order item not found');
  const itemReturn = await Return.create({
    orderId: order.id,
    orderItemId: orderItem.id,
    userId: req.user.id,
    reason: req.body.reason,
    description: req.body.description,
    photos: req.body.photos,
    refundAmount: orderItem.totalPrice,
  });
  order.status = 'return_requested';
  await order.save();
  return ApiResponse.success(res, 'Return requested successfully', { return: itemReturn }, undefined, 201);
});
