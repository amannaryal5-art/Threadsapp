const runtimeStore = require('../lib/runtime-store');
const { Category } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const productController = require('./product.controller');

exports.getCategories = asyncHandler(async (_req, res) => {
  const cached = await runtimeStore.get('categories:tree');
  if (cached) return ApiResponse.success(res, 'Categories fetched successfully', { categories: JSON.parse(cached) });

  const rootCategories = await Category.find({ isActive: true, parentId: null }).sort({ displayOrder: 1 }).lean();
  const categories = await Promise.all(
    rootCategories.map(async (category) => {
      const children = await Category.find({ isActive: true, parentId: category._id }).sort({ displayOrder: 1 }).lean();
      return { ...category, children };
    }),
  );

  await runtimeStore.set('categories:tree', JSON.stringify(categories), 'EX', 3600);
  return ApiResponse.success(res, 'Categories fetched successfully', { categories });
});

exports.getCategoryDetail = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!category) throw new ApiError(404, 'Category not found');
  const children = await Category.find({ parentId: category._id, isActive: true }).sort({ displayOrder: 1 }).lean();
  return ApiResponse.success(res, 'Category fetched successfully', { category: { ...category, children } });
});

exports.getCategoryProducts = productController.getProducts;
