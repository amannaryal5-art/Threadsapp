const { Address } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const normalizeAddressPayload = (payload = {}) => {
  const phone = String(payload.phone || '')
    .replace(/\D/g, '')
    .replace(/^0+(?=\d{10,15}$)/, '');
  const pincode = String(payload.pincode || '').replace(/\D/g, '').slice(0, 6);

  return {
    fullName: String(payload.fullName || '').trim(),
    phone,
    flatNo: payload.flatNo ? String(payload.flatNo).trim() : null,
    building: payload.building ? String(payload.building).trim() : null,
    street: payload.street ? String(payload.street).trim() : null,
    area: payload.area ? String(payload.area).trim() : null,
    city: String(payload.city || '').trim(),
    state: String(payload.state || '').trim(),
    pincode,
    country: String(payload.country || 'India').trim() || 'India',
    type: payload.type || 'home',
    isDefault: Boolean(payload.isDefault),
    lat: payload.lat === null || payload.lat === undefined || payload.lat === '' ? null : Number(payload.lat),
    lng: payload.lng === null || payload.lng === undefined || payload.lng === '' ? null : Number(payload.lng),
  };
};

exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({ where: { userId: req.user.id }, order: [['isDefault', 'DESC'], ['createdAt', 'DESC']] });
  return ApiResponse.success(res, 'Addresses fetched successfully', { addresses });
});

exports.createAddress = asyncHandler(async (req, res) => {
  const payload = normalizeAddressPayload(req.body);
  console.log('[address.create] payload', payload);
  if (payload.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  const address = await Address.create({ ...payload, userId: req.user.id });
  return ApiResponse.success(res, 'Address created successfully', { address }, undefined, 201);
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!address) throw new ApiError(404, 'Address not found');
  const payload = normalizeAddressPayload(req.body);
  console.log('[address.update] payload', payload);
  if (payload.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  await address.update(payload);
  return ApiResponse.success(res, 'Address updated successfully', { address });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const deleted = await Address.destroy({ where: { id: req.params.id, userId: req.user.id } });
  if (!deleted) throw new ApiError(404, 'Address not found');
  return ApiResponse.success(res, 'Address deleted successfully', {});
});

exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!address) throw new ApiError(404, 'Address not found');
  await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  address.isDefault = true;
  await address.save();
  return ApiResponse.success(res, 'Default address updated successfully', { address });
});
