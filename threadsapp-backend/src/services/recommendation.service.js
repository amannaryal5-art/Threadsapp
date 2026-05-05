const { Op, QueryTypes } = require('sequelize');
const runtimeStore = require('../lib/runtime-store');
const { Product, sequelize } = require('../models');

exports.getSimilarProducts = async (product, limit = 10) =>
  Product.findAll({
    where: {
      id: { [Op.ne]: product.id },
      isActive: true,
      [Op.or]: [
        { categoryId: product.categoryId },
        { brandId: product.brandId },
        { tags: { [Op.overlap]: product.tags || [] } },
      ],
    },
    limit,
    order: [['totalSold', 'DESC']],
  });

exports.trackRecentlyViewed = async (userId, productId) => {
  if (!userId) return;
  await runtimeStore.lrem(`viewed:${userId}`, 0, productId);
  await runtimeStore.lpush(`viewed:${userId}`, productId);
  await runtimeStore.ltrim(`viewed:${userId}`, 0, 9);
};

exports.getRecentlyViewed = async (userId) => runtimeStore.lrange(`viewed:${userId}`, 0, 9);

exports.frequentlyBoughtTogether = async (productId) =>
  sequelize.query(
    `
      SELECT oi2."productId", COUNT(*)::int AS score
      FROM "OrderItems" oi1
      JOIN "OrderItems" oi2 ON oi1."orderId" = oi2."orderId" AND oi2."productId" <> oi1."productId"
      WHERE oi1."productId" = :productId
      GROUP BY oi2."productId"
      ORDER BY score DESC
      LIMIT 10
    `,
    { replacements: { productId }, type: QueryTypes.SELECT },
  );
