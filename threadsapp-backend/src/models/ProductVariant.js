const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductVariant = sequelize.define(
  'ProductVariant',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    colorHex: DataTypes.STRING,
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    additionalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'ProductVariants',
    timestamps: true,
  },
);

module.exports = ProductVariant;
