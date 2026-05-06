const { Review, OrderItem, Product } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const refreshProductRatings = async (productId) => {
  const reviews = await Review.find({ productId, isApproved: true });
  const totalReviews = reviews.length;
  const averageRating = totalReviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  await Product.findByIdAndUpdate(productId, { totalReviews, averageRating: Number(averageRating.toFixed(2)) });
};

exports.createReview = asyncHandler(async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.body.orderItemId);
    if (!orderItem) throw new ApiError(404, 'Order item not found');
    if (orderItem.productId !== req.body.productId) throw new ApiError(400, 'Product mismatch');

    const review = await Review.create({ ...req.body, userId: req.user.id, isVerifiedPurchase: true });
    await refreshProductRatings(req.body.productId);
    return ApiResponse.success(res, 'Review created successfully', { review }, undefined, 201);
  } catch (error) {
    throw error;
  }
});

exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!review) throw new ApiError(404, 'Review not found');
  await review.update(req.body);
  await refreshProductRatings(review.productId);
  return ApiResponse.success(res, 'Review updated successfully', { review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!review) throw new ApiError(404, 'Review not found');
  const productId = review.productId;
  await review.destroy();
  await refreshProductRatings(productId);
  return ApiResponse.success(res, 'Review deleted successfully', {});
});

exports.markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  review.helpfulCount += 1;
  await review.save();
  return ApiResponse.success(res, 'Review marked helpful successfully', { review });
});
