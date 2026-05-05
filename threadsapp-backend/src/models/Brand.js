const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Brand',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      logo: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'Brands' },
  );
