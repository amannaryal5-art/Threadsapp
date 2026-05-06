const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true, unique: true, index: true },
    quantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
