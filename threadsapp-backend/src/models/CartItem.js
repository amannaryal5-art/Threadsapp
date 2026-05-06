const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    quantity: { type: Number, default: 1 },
    priceAtAdd: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
