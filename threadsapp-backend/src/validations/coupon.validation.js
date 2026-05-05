const Joi = require('joi');

exports.applyCouponSchema = Joi.object({
  code: Joi.string().required(),
  orderAmount: Joi.number().min(0).required(),
  categoryIds: Joi.array().items(Joi.string().uuid()).default([]),
});

exports.couponSchema = Joi.object({
  code: Joi.string().uppercase().required(),
  description: Joi.string().allow('', null),
  type: Joi.string().valid('percent', 'flat').required(),
  value: Joi.number().positive().required(),
  minOrderAmount: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0).allow(null),
  usageLimit: Joi.number().integer().min(1).allow(null),
  perUserLimit: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true),
  expiresAt: Joi.date().allow(null),
  applicableCategories: Joi.array().items(Joi.string().uuid()).allow(null),
});
