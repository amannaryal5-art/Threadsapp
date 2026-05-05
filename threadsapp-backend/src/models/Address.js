const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Address',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      fullName: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      flatNo: { type: DataTypes.STRING },
      building: { type: DataTypes.STRING },
      street: { type: DataTypes.STRING },
      area: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      pincode: { type: DataTypes.STRING, allowNull: false },
      country: { type: DataTypes.STRING, defaultValue: 'India' },
      type: { type: DataTypes.ENUM('home', 'work', 'other'), defaultValue: 'home' },
      isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
      lat: { type: DataTypes.FLOAT },
      lng: { type: DataTypes.FLOAT },
    },
    { tableName: 'Addresses' },
  );
