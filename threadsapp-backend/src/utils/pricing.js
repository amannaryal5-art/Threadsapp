const roundCurrency = (value) => Number(Number(value || 0).toFixed(2));

const getVariantMrp = (product, variant) => {
  const basePrice = Number(product?.basePrice || 0);
  const additionalPrice = Number(variant?.additionalPrice || 0);
  return roundCurrency(basePrice + additionalPrice);
};

const getVariantSellingPrice = (product, variant) => {
  const mrp = getVariantMrp(product, variant);
  const discountPercent = Math.max(Number(product?.discountPercent || 0), 0);
  return roundCurrency(mrp - (mrp * discountPercent) / 100);
};

module.exports = {
  roundCurrency,
  getVariantMrp,
  getVariantSellingPrice,
};
