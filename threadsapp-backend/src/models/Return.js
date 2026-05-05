const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Return',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      orderId: { type: DataTypes.UUID, allowNull: false },
      orderItemId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      reason: {
        type: DataTypes.ENUM('wrong_size', 'wrong_item', 'damaged', 'not_as_described', 'changed_mind'),
        allowNull: false,
      },
      description: { type: DataTypes.TEXT },
      photos: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      status: {
        type: DataTypes.ENUM('requested', 'approved', 'rejected', 'pickup_scheduled', 'picked', 'refund_initiated', 'refunded'),
        defaultValue: 'requested',
      },
      refundAmount: { type: DataTypes.DECIMAL(10, 2) },
      adminNotes: { type: DataTypes.TEXT },
    },
    { tableName: 'Returns' },
  );
