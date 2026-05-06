const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    targetType: { type: String, enum: ['category', 'product', 'url', 'none'], default: 'none' },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    targetUrl: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
