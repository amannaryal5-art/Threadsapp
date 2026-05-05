const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Review',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      productId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      orderItemId: { type: DataTypes.UUID, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      title: { type: DataTypes.STRING },
      comment: { type: DataTypes.TEXT },
      photos: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      fit: { type: DataTypes.ENUM('runs_small', 'true_to_size', 'runs_large') },
      isVerifiedPurchase: { type: DataTypes.BOOLEAN, defaultValue: true },
      helpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      isApproved: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'Reviews' },
  );
