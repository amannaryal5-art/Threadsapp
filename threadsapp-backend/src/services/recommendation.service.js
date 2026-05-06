const runtimeStore = require('../lib/runtime-store');
const { Product, OrderItem } = require('../models');

exports.getSimilarProducts = async (product, limit = 10) =>
  Product.find({
    _id: { $ne: product.id },
    isActive: true,
    $or: [{ categoryId: product.categoryId }, { brandId: product.brandId }, { tags: { $in: product.tags || [] } }],
  })
    .limit(limit)
    .sort({ totalSold: -1 });

exports.trackRecentlyViewed = async (userId, productId) => {
  if (!userId) return;
  await runtimeStore.lrem(`viewed:${userId}`, 0, productId);
  await runtimeStore.lpush(`viewed:${userId}`, productId);
  await runtimeStore.ltrim(`viewed:${userId}`, 0, 9);
};

exports.getRecentlyViewed = async (userId) => runtimeStore.lrange(`viewed:${userId}`, 0, 9);

exports.frequentlyBoughtTogether = async (productId) =>
  OrderItem.aggregate([
    { $match: { productId } },
    {
      $lookup: {
        from: 'orderitems',
        localField: 'orderId',
        foreignField: 'orderId',
        as: 'coItems',
      },
    },
    { $unwind: '$coItems' },
    { $match: { 'coItems.productId': { $ne: productId } } },
    { $group: { _id: '$coItems.productId', score: { $sum: 1 } } },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);
