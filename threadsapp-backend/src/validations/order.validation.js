const Joi = require('joi');

exports.createOrderSchema = Joi.object({
  addressId: Joi.string().uuid().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        variantId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  couponCode: Joi.string().allow('', null),
  paymentMethod: Joi.string().valid('cod', 'upi', 'card', 'netbanking', 'wallet').default('upi'),
});

exports.returnRequestSchema = Joi.object({
  orderItemId: Joi.string().uuid().required(),
  reason: Joi.string().valid('wrong_size', 'wrong_item', 'damaged', 'not_as_described', 'changed_mind').required(),
  description: Joi.string().allow('', null),
  photos: Joi.array().items(Joi.string()).default([]),
});
