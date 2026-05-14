const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Brand = sequelize.define(
  'Brand',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logo: DataTypes.STRING,
    description: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'Brands',
    timestamps: true,
  },
);

module.exports = Brand;
