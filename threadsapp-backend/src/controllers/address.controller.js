const { Address } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({ where: { userId: req.user.id }, order: [['isDefault', 'DESC'], ['createdAt', 'DESC']] });
  return ApiResponse.success(res, 'Addresses fetched successfully', { addresses });
});

exports.createAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  const address = await Address.create({ ...req.body, userId: req.user.id });
  return ApiResponse.success(res, 'Address created successfully', { address }, undefined, 201);
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!address) throw new ApiError(404, 'Address not found');
  if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
  await address.update(req.body);
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
