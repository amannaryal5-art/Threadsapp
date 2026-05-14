const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending_payment', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'return_picked', 'refunded'),
      allowNull: false,
      defaultValue: 'pending_payment',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    couponCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    couponDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shippingCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shiprocketOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiprocketShipmentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courierName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackingUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedDelivery: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    invoiceUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Orders',
    timestamps: true,
  },
);

module.exports = Order;
