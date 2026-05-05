const Joi = require('joi');

exports.productSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow('', null),
  categoryId: Joi.string().uuid().required(),
  brandId: Joi.string().uuid().required(),
  basePrice: Joi.number().positive().required(),
  discountPercent: Joi.number().integer().min(0).max(100).default(0),
  fabric: Joi.string().allow('', null),
  pattern: Joi.string().allow('', null),
  occasion: Joi.string().allow('', null),
  fit: Joi.string().allow('', null),
  care: Joi.string().allow('', null),
  countryOfOrigin: Joi.string().default('India'),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).default([]),
  variants: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().required(),
        color: Joi.string().required(),
        colorHex: Joi.string().allow('', null),
        sku: Joi.string().required(),
        additionalPrice: Joi.number().min(0).default(0),
        quantity: Joi.number().integer().min(0).default(0),
        lowStockThreshold: Joi.number().integer().min(0).default(5),
      }),
    )
    .default([]),
});

exports.variantSchema = Joi.object({
  size: Joi.string().required(),
  color: Joi.string().required(),
  colorHex: Joi.string().allow('', null),
  sku: Joi.string().required(),
  additionalPrice: Joi.number().min(0).default(0),
  quantity: Joi.number().integer().min(0).default(0),
  lowStockThreshold: Joi.number().integer().min(0).default(5),
});
