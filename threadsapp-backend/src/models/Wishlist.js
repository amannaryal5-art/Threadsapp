const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Wishlist',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      productId: { type: DataTypes.UUID, allowNull: false },
    },
    {
      tableName: 'Wishlists',
      indexes: [{ unique: true, fields: ['userId', 'productId'] }],
    },
  );
