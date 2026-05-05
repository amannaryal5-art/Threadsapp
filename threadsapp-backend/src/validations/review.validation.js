const Joi = require('joi');

exports.reviewSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  orderItemId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().allow('', null),
  comment: Joi.string().allow('', null),
  photos: Joi.array().items(Joi.string()).max(3).default([]),
  fit: Joi.string().valid('runs_small', 'true_to_size', 'runs_large').allow(null),
});
