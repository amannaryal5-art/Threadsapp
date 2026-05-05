const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Inventory',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      variantId: { type: DataTypes.UUID, allowNull: false, unique: true },
      quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
      lowStockThreshold: { type: DataTypes.INTEGER, defaultValue: 5 },
    },
    { tableName: 'Inventories' },
  );
