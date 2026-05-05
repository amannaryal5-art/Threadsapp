const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ProductVariant',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      productId: { type: DataTypes.UUID, allowNull: false },
      size: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING, allowNull: false },
      colorHex: { type: DataTypes.STRING },
      sku: { type: DataTypes.STRING, allowNull: false, unique: true },
      additionalPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    },
    { tableName: 'ProductVariants' },
  );
