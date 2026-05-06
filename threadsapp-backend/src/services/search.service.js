const runtimeStore = require('../lib/runtime-store');
const { Product, Brand, Category, ProductImage } = require('../models');

exports.searchProducts = async ({ q, page = 1, limit = 20 }) => {
  await runtimeStore.zincrby('trending_searches', 1, q);
  await runtimeStore.expire('trending_searches', 24 * 60 * 60);

  const offset = (Number(page) - 1) * Number(limit);

  return Product.find({
    isActive: true,
    $or: [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }, { tags: { $in: q.split(' ') } }],
  })
    .limit(Number(limit))
    .skip(offset)
    .sort({ totalSold: -1 })
    .populate('brandId')
    .populate('categoryId');
};

exports.getSuggestions = async (q) => {
  const rows = await Product.find({ name: { $regex: `^${q}`, $options: 'i' }, isActive: true }, { name: 1 }).limit(10);

  return [...new Set(rows.map((row) => row.name.toLowerCase()))];
};

exports.getTrending = async () => runtimeStore.zrevrange('trending_searches', 0, 9);
