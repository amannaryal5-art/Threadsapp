const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpaySignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'INR',
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refundId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'Payments',
    timestamps: true,
  },
);

module.exports = Payment;
