const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Category',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.TEXT },
      image: { type: DataTypes.STRING },
      parentId: { type: DataTypes.UUID },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: 'Categories' },
  );
