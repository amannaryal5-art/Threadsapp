const Joi = require('joi');

const phonePattern = /^[0-9]{10,15}$/;
const pincodePattern = /^[0-9]{6}$/;

exports.addressSchema = Joi.object({
  fullName: Joi.string().trim().min(2).required(),
  phone: Joi.string().trim().pattern(phonePattern).required().messages({
    'string.pattern.base': 'Phone must contain 10 to 15 digits',
  }),
  flatNo: Joi.string().trim().allow('', null),
  building: Joi.string().trim().allow('', null),
  street: Joi.string().trim().allow('', null),
  area: Joi.string().trim().allow('', null),
  city: Joi.string().trim().min(2).required(),
  state: Joi.string().trim().min(2).required(),
  pincode: Joi.string().trim().pattern(pincodePattern).required().messages({
    'string.pattern.base': 'Pincode must be exactly 6 digits',
  }),
  country: Joi.string().trim().min(2).default('India'),
  type: Joi.string().valid('home', 'work', 'other').default('home'),
  isDefault: Joi.boolean().default(false),
  lat: Joi.number().allow(null),
  lng: Joi.number().allow(null),
});
