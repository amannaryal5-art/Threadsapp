const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Banner',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: false },
      targetType: { type: DataTypes.ENUM('category', 'product', 'url', 'none'), defaultValue: 'none' },
      targetId: { type: DataTypes.UUID },
      targetUrl: { type: DataTypes.STRING },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
      startsAt: { type: DataTypes.DATE },
      endsAt: { type: DataTypes.DATE },
    },
    { tableName: 'Banners' },
  );
