const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const searchService = require('../services/search.service');

exports.search = asyncHandler(async (req, res) => {
  const products = await searchService.searchProducts(req.query);
  return ApiResponse.success(res, 'Search results fetched successfully', { products });
});

exports.suggestions = asyncHandler(async (req, res) => {
  const suggestions = await searchService.getSuggestions(req.query.q || '');
  return ApiResponse.success(res, 'Search suggestions fetched successfully', { suggestions });
});

exports.trending = asyncHandler(async (_req, res) => {
  const keywords = await searchService.getTrending();
  return ApiResponse.success(res, 'Trending searches fetched successfully', { keywords });
});
