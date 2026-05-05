const { QueryTypes, Op } = require('sequelize');
const runtimeStore = require('../lib/runtime-store');
const { sequelize, Product, Brand, Category, ProductImage } = require('../models');

exports.searchProducts = async ({ q, page = 1, limit = 20 }) => {
  await runtimeStore.zincrby('trending_searches', 1, q);
  await runtimeStore.expire('trending_searches', 24 * 60 * 60);

  const offset = (Number(page) - 1) * Number(limit);

  try {
    const rows = await sequelize.query(
      `
      SELECT p.*
      FROM "Products" p
      WHERE p."isActive" = true
        AND (
          p."searchVector" @@ plainto_tsquery('english', :q)
          OR similarity(p.name, :q) > 0.2
          OR similarity(COALESCE(p.description, ''), :q) > 0.15
        )
      ORDER BY
        ts_rank(p."searchVector", plainto_tsquery('english', :q)) DESC,
        p."totalSold" DESC
      LIMIT :limit OFFSET :offset
      `,
      { replacements: { q, limit: Number(limit), offset }, type: QueryTypes.SELECT },
    );

    return rows;
  } catch (_error) {
    return Product.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ name: { [Op.iLike]: `%${q}%` } }, { description: { [Op.iLike]: `%${q}%` } }, { tags: { [Op.overlap]: q.split(' ') } }],
      },
      include: [Brand, Category, { model: ProductImage, as: 'images' }],
      limit: Number(limit),
      offset,
      order: [['totalSold', 'DESC']],
    });
  }
};

exports.getSuggestions = async (q) => {
  const rows = await Product.findAll({
    where: { name: { [Op.iLike]: `${q}%` }, isActive: true },
    attributes: ['name'],
    limit: 10,
  });

  return [...new Set(rows.map((row) => row.name.toLowerCase()))];
};

exports.getTrending = async () => runtimeStore.zrevrange('trending_searches', 0, 9);
