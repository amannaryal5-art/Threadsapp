const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'OrderItem',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orderId: { type: DataTypes.UUID, allowNull: false },
      productId: { type: DataTypes.UUID, allowNull: false },
      variantId: { type: DataTypes.UUID, allowNull: false },
      productName: { type: DataTypes.STRING, allowNull: false },
      variantDetails: { type: DataTypes.JSONB, allowNull: false },
      productImage: { type: DataTypes.STRING },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      mrp: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      sellingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discountPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
      totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'OrderItems' },
  );
