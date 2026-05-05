const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Coupon',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.STRING },
      type: { type: DataTypes.ENUM('percent', 'flat'), allowNull: false },
      value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      minOrderAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      maxDiscount: { type: DataTypes.DECIMAL(10, 2) },
      usageLimit: { type: DataTypes.INTEGER },
      usageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      perUserLimit: { type: DataTypes.INTEGER, defaultValue: 1 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      expiresAt: { type: DataTypes.DATE },
      applicableCategories: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: null },
    },
    { tableName: 'Coupons' },
  );
