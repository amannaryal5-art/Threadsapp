const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Notification',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      body: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.ENUM('order', 'payment', 'offer', 'system'), defaultValue: 'system' },
      data: { type: DataTypes.JSONB, defaultValue: {} },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: 'Notifications' },
  );
