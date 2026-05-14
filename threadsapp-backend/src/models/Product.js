const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const applyDerivedPricing = (product) => {
  const basePrice = Number(product.basePrice || 0);
  const discount = Number(product.discountPercent || 0);
  product.sellingPrice = Number((basePrice - (basePrice * discount) / 100).toFixed(2));
};

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sellingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fabric: DataTypes.STRING,
    pattern: DataTypes.STRING,
    occasion: DataTypes.STRING,
    fit: DataTypes.STRING,
    care: DataTypes.TEXT,
    countryOfOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'India',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalSold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: 'Products',
    timestamps: true,
    hooks: {
      beforeValidate: applyDerivedPricing,
      beforeCreate: applyDerivedPricing,
      beforeUpdate: applyDerivedPricing,
      beforeSave: applyDerivedPricing,
    },
  },
);

module.exports = Product;
