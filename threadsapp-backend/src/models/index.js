const mongoose = require('mongoose');
const { sequelize } = require('../config/database');

const models = {
  User: require('./User'),
  EmailOtp: require('./EmailOtp'),
  Address: require('./Address'),
  Category: require('./Category'),
  Brand: require('./Brand'),
  Product: require('./Product'),
  ProductVariant: require('./ProductVariant'),
  ProductImage: require('./ProductImage'),
  Inventory: require('./Inventory'),
  Cart: require('./Cart'),
  CartItem: require('./CartItem'),
  Wishlist: require('./Wishlist'),
  Order: require('./Order'),
  OrderItem: require('./OrderItem'),
  Payment: require('./Payment'),
  Coupon: require('./Coupon'),
  CouponUsage: require('./CouponUsage'),
  Review: require('./Review'),
  Return: require('./Return'),
  Notification: require('./Notification'),
  Banner: require('./Banner'),
};

models.Address.belongsTo(models.User, { foreignKey: 'userId' });
models.User.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses' });
models.Order.belongsTo(models.User, { foreignKey: 'userId' });
models.Order.belongsTo(models.Address, { foreignKey: 'addressId' });
models.User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
models.Address.hasMany(models.Order, { foreignKey: 'addressId' });
models.Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
models.OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
models.OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
models.OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'variantId' });
models.Order.hasOne(models.Payment, { foreignKey: 'orderId', as: 'payment' });
models.Payment.belongsTo(models.Order, { foreignKey: 'orderId' });
models.Payment.belongsTo(models.User, { foreignKey: 'userId' });
models.User.hasMany(models.Payment, { foreignKey: 'userId', as: 'payments' });
models.Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
models.Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
models.Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
models.Product.hasMany(models.ProductVariant, { foreignKey: 'productId', as: 'variants' });
models.ProductVariant.belongsTo(models.Product, { foreignKey: 'productId' });
models.ProductVariant.hasOne(models.Inventory, { foreignKey: 'variantId', as: 'inventory' });
models.Inventory.belongsTo(models.ProductVariant, { foreignKey: 'variantId', as: 'variant' });
models.ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
models.ProductImage.belongsTo(models.ProductVariant, { foreignKey: 'variantId', as: 'variant' });
models.ProductVariant.hasMany(models.ProductImage, { foreignKey: 'variantId', as: 'variantImages' });
models.Cart.belongsTo(models.User, { foreignKey: 'userId' });
models.User.hasOne(models.Cart, { foreignKey: 'userId', as: 'cart' });
models.Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
models.CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
models.CartItem.belongsTo(models.Product, { foreignKey: 'productId' });
models.CartItem.belongsTo(models.ProductVariant, { foreignKey: 'variantId' });
models.Product.hasMany(models.CartItem, { foreignKey: 'productId' });
models.ProductVariant.hasMany(models.CartItem, { foreignKey: 'variantId' });

const normalizeFilter = (options = {}) => options.where || options;
const normalizeSort = (order) => {
  if (!Array.isArray(order)) return undefined;
  const out = {};
  for (const item of order) {
    if (Array.isArray(item) && typeof item[0] === 'string') out[item[0]] = String(item[1]).toUpperCase() === 'DESC' ? -1 : 1;
  }
  return out;
};

Object.values(models).forEach((Model) => {
  const isMongooseModel = typeof Model.find === 'function' && typeof Model.updateMany === 'function';
  if (!isMongooseModel) {
    return;
  }

  if (!Model.findAll) {
    Model.findAll = async (options = {}) => {
      const query = Model.find(normalizeFilter(options));
      const sort = normalizeSort(options.order);
      if (sort) query.sort(sort);
      if (options.limit) query.limit(options.limit);
      if (options.offset) query.skip(options.offset);
      return query.exec();
    };
  }

  if (!Model.findByPk) {
    Model.findByPk = (id) => Model.findById(id);
  }

  if (!Model.findAndCountAll) {
    Model.findAndCountAll = async (options = {}) => {
      const filter = normalizeFilter(options);
      const [rows, count] = await Promise.all([
        Model.findAll(options),
        Model.countDocuments(filter),
      ]);
      return { rows, count };
    };
  }

  if (!Model.count) {
    Model.count = (options = {}) => Model.countDocuments(normalizeFilter(options));
  }

  if (!Model.sum) {
    Model.sum = async (field, options = {}) => {
      const res = await Model.aggregate([{ $match: normalizeFilter(options) }, { $group: { _id: null, total: { $sum: `$${field}` } } }]);
      return res?.[0]?.total || 0;
    };
  }

  const originalUpdate = Model.updateMany.bind(Model);
  Model.update = (values, options = {}) => originalUpdate(normalizeFilter(options), values);
  Model.destroy = (options = {}) => Model.deleteMany(normalizeFilter(options));
  Model.increment = async (field, { by = 1, where = {} } = {}) => Model.updateMany(where, { $inc: { [field]: by } });

  if (!Model.prototype.destroy) {
    Model.prototype.destroy = function destroy() {
      return this.deleteOne();
    };
  }
});

module.exports = { sequelize, ...models, mongoose };
