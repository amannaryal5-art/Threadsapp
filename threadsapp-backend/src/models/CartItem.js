const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'CartItem',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      cartId: { type: DataTypes.UUID, allowNull: false },
      productId: { type: DataTypes.UUID, allowNull: false },
      variantId: { type: DataTypes.UUID, allowNull: false },
      quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
      priceAtAdd: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: 'CartItems' },
  );
