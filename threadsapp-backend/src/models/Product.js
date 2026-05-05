const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Product',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
      categoryId: { type: DataTypes.UUID, allowNull: false },
      brandId: { type: DataTypes.UUID, allowNull: false },
      basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discountPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
      sellingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      fabric: { type: DataTypes.STRING },
      pattern: { type: DataTypes.STRING },
      occasion: { type: DataTypes.STRING },
      fit: { type: DataTypes.STRING },
      care: { type: DataTypes.TEXT },
      countryOfOrigin: { type: DataTypes.STRING, defaultValue: 'India' },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
      averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
      totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
      totalSold: { type: DataTypes.INTEGER, defaultValue: 0 },
      tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      searchVector: { type: 'TSVECTOR' },
    },
    {
      tableName: 'Products',
      indexes: [
        { fields: ['categoryId'] },
        { fields: ['brandId'] },
        { fields: ['isActive'] },
        { fields: ['sellingPrice'] },
        { fields: ['averageRating'] },
        { fields: ['tags'], using: 'gin' },
        { fields: ['searchVector'], using: 'gin' },
      ],
      hooks: {
        beforeValidate: (product) => {
          const basePrice = Number(product.basePrice || 0);
          const discount = Number(product.discountPercent || 0);
          product.sellingPrice = (basePrice - (basePrice * discount) / 100).toFixed(2);
        },
      },
    },
  );
