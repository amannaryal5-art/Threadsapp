const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Payment',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orderId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      razorpayOrderId: { type: DataTypes.STRING },
      razorpayPaymentId: { type: DataTypes.STRING },
      razorpaySignature: { type: DataTypes.STRING },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING, defaultValue: 'INR' },
      status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
      method: { type: DataTypes.STRING },
      refundId: { type: DataTypes.STRING },
      refundAmount: { type: DataTypes.DECIMAL(10, 2) },
    },
    { tableName: 'Payments' },
  );
