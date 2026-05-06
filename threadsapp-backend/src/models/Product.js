const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    basePrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
    fabric: String,
    pattern: String,
    occasion: String,
    fit: String,
    care: String,
    countryOfOrigin: { type: String, default: 'India' },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

productSchema.pre('validate', function onValidate(next) {
  const basePrice = Number(this.basePrice || 0);
  const discount = Number(this.discountPercent || 0);
  this.sellingPrice = Number((basePrice - (basePrice * discount) / 100).toFixed(2));
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
