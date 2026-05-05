const { Brand } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const productController = require('./product.controller');

exports.getBrands = asyncHandler(async (_req, res) => {
  const brands = await Brand.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
  return ApiResponse.success(res, 'Brands fetched successfully', { brands });
});

exports.getBrandProducts = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findOne({ where: { slug: req.params.slug, isActive: true } });
  if (!brand) throw new ApiError(404, 'Brand not found');
  req.query.brand = req.params.slug;
  return productController.getProducts(req, res, next);
});
