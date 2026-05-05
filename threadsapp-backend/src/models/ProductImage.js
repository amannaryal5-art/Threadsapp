const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ProductImage',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      productId: { type: DataTypes.UUID, allowNull: false },
      variantId: { type: DataTypes.UUID },
      url: { type: DataTypes.STRING, allowNull: false },
      altText: { type: DataTypes.STRING },
      isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
      displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: 'ProductImages' },
  );
