const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', default: null },
    url: { type: String, required: true },
    altText: String,
    isPrimary: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.ProductImage || mongoose.model('ProductImage', productImageSchema);
