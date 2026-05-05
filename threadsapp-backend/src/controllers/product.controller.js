const { Op } = require('sequelize');
const runtimeStore = require('../lib/runtime-store');
const { Product, ProductVariant, ProductImage, Inventory, Category, Brand, Review } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');
const recommendationService = require('../services/recommendation.service');

const productCardIncludes = [
  { model: Category },
  { model: Brand },
  { model: ProductImage, as: 'images' },
  { model: ProductVariant, as: 'variants', include: [{ model: Inventory, as: 'inventory' }] },
];

const buildProductWhere = async (query) => {
  const where = { isActive: true };
  if (query.category) {
    const category = await Category.findOne({ where: { slug: query.category } });
    if (category) where.categoryId = category.id;
  }
  if (query.brand) {
    const brand = await Brand.findOne({ where: { slug: query.brand } });
    if (brand) where.brandId = brand.id;
  }
  if (query.minPrice || query.maxPrice) {
    where.sellingPrice = {};
    if (query.minPrice) where.sellingPrice[Op.gte] = Number(query.minPrice);
    if (query.maxPrice) where.sellingPrice[Op.lte] = Number(query.maxPrice);
  }
  if (query.fabric) where.fabric = { [Op.in]: query.fabric.split(',') };
  if (query.occasion) where.occasion = { [Op.in]: query.occasion.split(',') };
  if (query.fit) where.fit = { [Op.in]: query.fit.split(',') };
  if (query.pattern) where.pattern = { [Op.in]: query.pattern.split(',') };
  if (query.rating) where.averageRating = { [Op.gte]: Number(query.rating) };
  return where;
};

exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit);
  const where = await buildProductWhere(req.query);
  if (req.params.slug && !req.query.category && req.route.path.includes('/products')) {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    if (category) where.categoryId = category.id;
  }

  const variantWhere = {};
  if (req.query.size) variantWhere.size = { [Op.in]: req.query.size.split(',') };
  if (req.query.color) variantWhere.color = { [Op.in]: req.query.color.split(',') };

  const include = [
    { model: Category },
    { model: Brand },
    { model: ProductImage, as: 'images' },
    {
      model: ProductVariant,
      as: 'variants',
      required: Boolean(req.query.size || req.query.color || req.query.inStock === 'true'),
      where: Object.keys(variantWhere).length ? variantWhere : undefined,
      include: [{ model: Inventory, as: 'inventory', required: req.query.inStock === 'true', where: req.query.inStock === 'true' ? { quantity: { [Op.gt]: 0 } } : undefined }],
    },
  ];

  const orderMap = {
    price_asc: [['sellingPrice', 'ASC']],
    price_desc: [['sellingPrice', 'DESC']],
    newest: [['createdAt', 'DESC']],
    popular: [['totalSold', 'DESC']],
    rating: [['averageRating', 'DESC']],
  };

  const { rows, count } = await Product.findAndCountAll({
    where,
    include,
    distinct: true,
    limit,
    offset,
    order: orderMap[req.query.sort] || [['createdAt', 'DESC']],
  });

  return ApiResponse.success(res, 'Products fetched successfully', { products: rows }, { page, limit, total: count, totalPages: Math.ceil(count / limit) });
});

exports.getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.findAll({
    where: { isFeatured: true, isActive: true },
    include: productCardIncludes,
    limit: 20,
  });
  return ApiResponse.success(res, 'Featured products fetched successfully', { products });
});

exports.getNewArrivals = asyncHandler(async (_req, res) => {
  const products = await Product.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']],
    limit: 20,
    include: productCardIncludes,
  });
  return ApiResponse.success(res, 'New arrivals fetched successfully', { products });
});

exports.getTrendingProducts = asyncHandler(async (_req, res) => {
  const products = await Product.findAll({
    where: { isActive: true },
    order: [['totalSold', 'DESC']],
    limit: 20,
    include: productCardIncludes,
  });
  return ApiResponse.success(res, 'Trending products fetched successfully', { products });
});

exports.getDeals = asyncHandler(async (_req, res) => {
  const products = await Product.findAll({
    where: { isActive: true, discountPercent: { [Op.gte]: 30 } },
    limit: 20,
    include: productCardIncludes,
  });
  return ApiResponse.success(res, 'Deals fetched successfully', { products });
});

exports.getProductDetail = asyncHandler(async (req, res) => {
  const cacheKey = `product:${req.params.slug}`;
  const cached = await runtimeStore.get(cacheKey);
  if (cached) return ApiResponse.success(res, 'Product fetched successfully', { product: JSON.parse(cached) });

  const product = await Product.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [
      { model: Category },
      { model: Brand },
      { model: ProductImage, as: 'images' },
      { model: ProductVariant, as: 'variants', include: [{ model: Inventory, as: 'inventory' }, { model: ProductImage, as: 'variantImages', required: false }] },
    ],
  });

  if (!product) throw new ApiError(404, 'Product not found');
  await runtimeStore.set(cacheKey, JSON.stringify(product), 'EX', 900);
  await recommendationService.trackRecentlyViewed(req.user?.id, product.id);
  return ApiResponse.success(res, 'Product fetched successfully', { product });
});

exports.getProductReviews = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit);
  const product = await Product.findOne({ where: { slug: req.params.slug } });
  if (!product) throw new ApiError(404, 'Product not found');

  const where = { productId: product.id, isApproved: true };
  if (req.query.rating) where.rating = Number(req.query.rating);

  const { rows, count } = await Review.findAndCountAll({ where, limit, offset, order: [['createdAt', 'DESC']] });
  return ApiResponse.success(res, 'Reviews fetched successfully', { reviews: rows }, { page, limit, total: count, totalPages: Math.ceil(count / limit) });
});

exports.getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ where: { slug: req.params.slug } });
  if (!product) throw new ApiError(404, 'Product not found');
  const products = await recommendationService.getSimilarProducts(product);
  return ApiResponse.success(res, 'Similar products fetched successfully', { products });
});
