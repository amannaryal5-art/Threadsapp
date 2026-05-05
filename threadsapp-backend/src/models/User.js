const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'User',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING },
      profilePhoto: { type: DataTypes.STRING },
      gender: { type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'), defaultValue: 'prefer_not_to_say' },
      dateOfBirth: { type: DataTypes.DATEONLY },
      isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
      fcmToken: { type: DataTypes.STRING },
      loyaltyPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      tableName: 'Users',
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['passwordHash'] },
        },
      },
    },
  );
