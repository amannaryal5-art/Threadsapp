const Op = { in: '$in' };
const runtimeStore = require('../lib/runtime-store');
const {
  sequelize,
  User,
  Address,
  Product,
  ProductVariant,
  ProductImage,
  Inventory,
  Order,
  OrderItem,
  Payment,
} = require('../models');
const ApiError = require('../utils/ApiError');
const couponService = require('./coupon.service');
const paymentService = require('./payment.service');
const notificationService = require('./notification.service');
const emailService = require('./email.service');
const invoiceService = require('./invoice.service');
const shippingService = require('./shipping.service');

const buildOrderNumber = async () => {
  const count = await Order.count();
  return `TH-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
};

const getLockKey = (variantId) => `inv_lock:${variantId}`;

exports.lockInventory = async (items) => {
  for (const item of items) {
    const locked = await runtimeStore.set(getLockKey(item.variantId), item.quantity, 'NX', 'EX', 600);
    if (!locked) {
      throw new ApiError(409, 'Inventory currently locked for another checkout', [
        { field: 'variantId', message: `Variant ${item.variantId} is being purchased by another user` },
      ]);
    }
  }
};

exports.releaseInventoryLocks = async (items) => {
  await Promise.all(items.map((item) => runtimeStore.del(getLockKey(item.variantId))));
};

exports.createOrder = async ({ userId, addressId, items, couponCode, paymentMethod = 'upi' }) => {
  const user = await User.findByPk(userId);
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) throw new ApiError(404, 'Address not found');
  if (!items?.length) throw new ApiError(400, 'Order items are required');

  const variants = await ProductVariant.findAll({
    where: { id: { [Op.in]: items.map((item) => item.variantId) } },
    include: [
      {
        model: Product,
        include: [{ model: ProductImage, as: 'images' }],
      },
      { model: Inventory, as: 'inventory' },
    ],
  });

  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));
  await exports.lockInventory(items);

  try {
    let subtotal = 0;
    const categoryIds = [];
    const orderItemsPayload = items.map((item) => {
      const variant = variantMap.get(item.variantId);
      if (!variant || variant.productId !== item.productId) {
        throw new ApiError(400, 'Invalid variant selected');
      }

      if (!variant.inventory || variant.inventory.quantity < item.quantity) {
        throw new ApiError(400, 'Out of stock', [
          { field: 'variantId', message: `Only ${variant.inventory?.quantity || 0} items left in stock` },
        ]);
      }

      const product = variant.Product;
      categoryIds.push(product.categoryId);
      const unitPrice = Number(product.sellingPrice) + Number(variant.additionalPrice);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantDetails: { size: variant.size, color: variant.color, sku: variant.sku },
        productImage: product.images.find((image) => image.isPrimary)?.url || product.images[0]?.url || null,
        quantity: item.quantity,
        mrp: product.basePrice,
        sellingPrice: unitPrice.toFixed(2),
        discountPercent: product.discountPercent,
        totalPrice: totalPrice.toFixed(2),
      };
    });

    let coupon = null;
    let couponDiscount = 0;
    if (couponCode) {
      const couponResult = await couponService.validateCoupon({
        code: couponCode,
        orderAmount: subtotal,
        userId,
        categoryIds,
      });
      coupon = couponResult.coupon;
      couponDiscount = couponResult.discountAmount;
    }

    const shippingCharge = subtotal >= Number(process.env.FREE_SHIPPING_THRESHOLD || 499) ? 0 : 49;
    const taxableAmount = Math.max(subtotal - couponDiscount, 0) + shippingCharge;
    const taxAmount = taxableAmount * Number(process.env.GST_RATE || 0.18);
    const totalAmount = taxableAmount + taxAmount;
    const orderNumber = await buildOrderNumber();
    const isCod = paymentMethod === 'cod';
    const razorpayOrder = isCod
      ? null
      : await paymentService.createRazorpayOrder({
          amount: totalAmount,
          receipt: orderNumber,
          notes: { userId, orderNumber },
        });

    const transaction = await sequelize.transaction();
    try {
      const order = await Order.create(
        {
          orderNumber,
          userId,
          addressId,
          subtotal: subtotal.toFixed(2),
          discountAmount: couponDiscount.toFixed(2),
          couponCode: coupon?.code || null,
          couponDiscount: couponDiscount.toFixed(2),
          shippingCharge: shippingCharge.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          status: isCod ? 'confirmed' : 'pending_payment',
          paymentStatus: isCod ? 'pending' : 'pending',
        },
        { transaction },
      );

      await OrderItem.bulkCreate(orderItemsPayload.map((item) => ({ ...item, orderId: order.id })), { transaction });
      await Payment.create(
        {
          orderId: order.id,
          userId,
          razorpayOrderId: razorpayOrder?.id || null,
          amount: totalAmount.toFixed(2),
          status: 'pending',
          method: paymentMethod,
        },
        { transaction },
      );

      if (isCod) {
        for (const item of orderItemsPayload) {
          const inventory = await Inventory.findOne({ where: { variantId: item.variantId }, transaction, lock: transaction.LOCK.UPDATE });
          if (!inventory || inventory.quantity < item.quantity) {
            throw new ApiError(400, 'Inventory mismatch during COD confirmation');
          }
          inventory.quantity -= item.quantity;
          await inventory.save({ transaction });
          await Product.increment('totalSold', { by: item.quantity, where: { id: item.productId }, transaction });
        }
      }

      await transaction.commit();

      await exports.releaseInventoryLocks(items);

      return {
        order,
        user,
        address,
        coupon,
        razorpayOrder,
        summary: {
          subtotal: Number(subtotal.toFixed(2)),
          couponDiscount: Number(couponDiscount.toFixed(2)),
          shippingCharge,
          taxAmount: Number(taxAmount.toFixed(2)),
          totalAmount: Number(totalAmount.toFixed(2)),
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    await exports.releaseInventoryLocks(items);
    throw error;
  }
};

exports.finalizePaidOrder = async ({ orderId, razorpayPaymentId, razorpaySignature, method = 'upi' }) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment' },
        { model: User },
        { model: Address },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) throw new ApiError(404, 'Order not found');
    if (order.paymentStatus === 'paid') {
      await transaction.commit();
      return order;
    }

    for (const item of order.items) {
      const inventory = await Inventory.findOne({ where: { variantId: item.variantId }, transaction, lock: transaction.LOCK.UPDATE });
      if (!inventory || inventory.quantity < item.quantity) {
        throw new ApiError(400, 'Inventory mismatch during confirmation');
      }
      inventory.quantity -= item.quantity;
      await inventory.save({ transaction });
      await Product.increment('totalSold', { by: item.quantity, where: { id: item.productId }, transaction });
      await runtimeStore.del(getLockKey(item.variantId));
    }

    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    await order.save({ transaction });

    order.payment.status = 'paid';
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.payment.method = method;
    await order.payment.save({ transaction });

    if (order.couponCode) {
      const validated = await couponService.validateCoupon({
        code: order.couponCode,
        orderAmount: order.subtotal,
        userId: order.userId,
        categoryIds: [],
      });
      await couponService.recordUsage({
        couponId: validated.coupon.id,
        userId: order.userId,
        orderId: order.id,
        discountApplied: order.couponDiscount,
        transaction,
      });
    }

    await transaction.commit();

    const fullOrder = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment' },
        { model: User },
        { model: Address },
      ],
    });

    const invoiceUrl = await invoiceService.generateInvoice(fullOrder);
    fullOrder.invoiceUrl = invoiceUrl;
    await fullOrder.save();

    await notificationService.pushToUser({
      userId: fullOrder.userId,
      title: 'Order confirmed',
      body: `Your order ${fullOrder.orderNumber} is confirmed`,
      type: 'order',
      data: { orderId: fullOrder.id, status: fullOrder.status },
    });

    if (fullOrder.User.email) {
      await emailService.sendOrderConfirmation(fullOrder.User, fullOrder, invoiceUrl);
    }

    const shipment = await shippingService.createOrder(fullOrder);
    if (shipment?.shipment_id || shipment?.order_id) {
      fullOrder.shiprocketOrderId = String(shipment.order_id || '');
      fullOrder.shiprocketShipmentId = String(shipment.shipment_id || '');
      const courier = fullOrder.shiprocketShipmentId ? await shippingService.assignCourier(fullOrder.shiprocketShipmentId) : null;
      fullOrder.trackingNumber = courier?.response?.data?.awb_code || fullOrder.trackingNumber;
      fullOrder.courierName = courier?.response?.data?.courier_name || fullOrder.courierName;
      fullOrder.trackingUrl = courier?.response?.data?.tracking_url || fullOrder.trackingUrl;
      await fullOrder.save();
    }

    return fullOrder;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
