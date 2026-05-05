const { sequelize } = require('../config/database');

const User = require('./User')(sequelize);
const Address = require('./Address')(sequelize);
const Category = require('./Category')(sequelize);
const Brand = require('./Brand')(sequelize);
const Product = require('./Product')(sequelize);
const ProductVariant = require('./ProductVariant')(sequelize);
const ProductImage = require('./ProductImage')(sequelize);
const Inventory = require('./Inventory')(sequelize);
const Cart = require('./Cart')(sequelize);
const CartItem = require('./CartItem')(sequelize);
const Wishlist = require('./Wishlist')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Payment = require('./Payment')(sequelize);
const Coupon = require('./Coupon')(sequelize);
const CouponUsage = require('./CouponUsage')(sequelize);
const Review = require('./Review')(sequelize);
const Return = require('./Return')(sequelize);
const Notification = require('./Notification')(sequelize);
const Banner = require('./Banner')(sequelize);

// -- Associations ------------------------------------------

User.hasOne(Cart, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });
User.hasMany(Wishlist, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });
User.hasMany(CouponUsage, { foreignKey: 'userId' });

Address.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Brand.hasMany(Product, { foreignKey: 'brandId' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
Product.hasMany(Review, { foreignKey: 'productId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });

ProductVariant.belongsTo(Product, { foreignKey: 'productId' });
ProductVariant.hasOne(Inventory, { foreignKey: 'variantId', as: 'inventory' });
ProductVariant.hasMany(ProductImage, { foreignKey: 'variantId' });

ProductImage.belongsTo(Product, { foreignKey: 'productId' });
ProductImage.belongsTo(ProductVariant, { foreignKey: 'variantId' });

Inventory.belongsTo(ProductVariant, { foreignKey: 'variantId' });

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Address, { foreignKey: 'addressId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

Payment.belongsTo(Order, { foreignKey: 'orderId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Coupon.hasMany(CouponUsage, { foreignKey: 'couponId' });
CouponUsage.belongsTo(Coupon, { foreignKey: 'couponId' });
CouponUsage.belongsTo(User, { foreignKey: 'userId' });
CouponUsage.belongsTo(Order, { foreignKey: 'orderId' });

Review.belongsTo(Product, { foreignKey: 'productId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(OrderItem, { foreignKey: 'orderItemId' });

Return.belongsTo(Order, { foreignKey: 'orderId' });
Return.belongsTo(OrderItem, { foreignKey: 'orderItemId' });
Return.belongsTo(User, { foreignKey: 'userId' });

Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User, Address, Category, Brand,
  Product, ProductVariant, ProductImage, Inventory,
  Cart, CartItem, Wishlist,
  Order, OrderItem, Payment,
  Coupon, CouponUsage,
  Review, Return, Notification, Banner,
};
