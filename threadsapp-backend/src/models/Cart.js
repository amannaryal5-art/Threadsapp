const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Cart',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false, unique: true },
    },
    { tableName: 'Carts' },
  );
