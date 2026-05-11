const mongoose = require('mongoose');

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

const sequelize = {
  authenticate: async () => true,
  transaction: async () => ({
    LOCK: { UPDATE: 'UPDATE' },
    commit: async () => {},
    rollback: async () => {},
  }),
};

module.exports = { sequelize, ...models, mongoose };
