const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define(
  'Address',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flatNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    building: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'India',
    },
    type: {
      type: DataTypes.ENUM('home', 'work', 'other'),
      allowNull: false,
      defaultValue: 'home',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'Addresses',
    timestamps: true,
  },
);

module.exports = Address;
