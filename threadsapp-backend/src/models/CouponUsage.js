const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'CouponUsage',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      couponId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      orderId: { type: DataTypes.UUID, allowNull: false },
      discountApplied: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'CouponUsages' },
  );
