const { Op } = require('sequelize');
const runtimeStore = require('../lib/runtime-store');
const { Category } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const productController = require('./product.controller');

exports.getCategories = asyncHandler(async (_req, res) => {
  const cached = await runtimeStore.get('categories:tree');
  if (cached) return ApiResponse.success(res, 'Categories fetched successfully', { categories: JSON.parse(cached) });

  const categories = await Category.findAll({
    where: { isActive: true, parentId: null },
    include: [{ model: Category, as: 'children', where: { isActive: true }, required: false }],
    order: [['displayOrder', 'ASC'], [{ model: Category, as: 'children' }, 'displayOrder', 'ASC']],
  });

  await runtimeStore.set('categories:tree', JSON.stringify(categories), 'EX', 3600);
  return ApiResponse.success(res, 'Categories fetched successfully', { categories });
});

exports.getCategoryDetail = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [{ model: Category, as: 'children', required: false }],
  });
  if (!category) throw new ApiError(404, 'Category not found');
  return ApiResponse.success(res, 'Category fetched successfully', { category });
});

exports.getCategoryProducts = productController.getProducts;
