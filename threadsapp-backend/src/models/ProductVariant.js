const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: String,
    sku: { type: String, required: true, unique: true },
    additionalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.ProductVariant || mongoose.model('ProductVariant', productVariantSchema);
