function getRequestOrigin(req) {
  if (!req) return process.env.PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:5000';
  return `${req.protocol}://${req.get('host')}`;
}

function normalizeImageUrl(url, req) {
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const origin = getRequestOrigin(req).replace(/\/$/, '');
  const normalized = String(url).replace(/\\/g, '/');

  if (normalized.startsWith('/uploads/')) {
    return `${origin}${normalized}`;
  }

  if (normalized.startsWith('uploads/')) {
    return `${origin}/${normalized}`;
  }

  const uploadsIndex = normalized.lastIndexOf('/uploads/');
  if (uploadsIndex >= 0) {
    return `${origin}${normalized.slice(uploadsIndex)}`;
  }

  const relativeUploadsIndex = normalized.lastIndexOf('uploads/');
  if (relativeUploadsIndex >= 0) {
    return `${origin}/${normalized.slice(relativeUploadsIndex)}`;
  }

  return normalized;
}

function sortImages(images = []) {
  return [...images].sort((left, right) => {
    if (Boolean(left.isPrimary) !== Boolean(right.isPrimary)) return left.isPrimary ? -1 : 1;
    return Number(left.displayOrder || 0) - Number(right.displayOrder || 0);
  });
}

function normalizeImage(image, req) {
  if (!image) return image;
  const normalized = typeof image.toJSON === 'function' ? image.toJSON() : { ...image };
  normalized.url = normalizeImageUrl(normalized.url, req);
  return normalized;
}

function normalizeProduct(product, req) {
  if (!product) return product;

  const normalized = typeof product.toJSON === 'function' ? product.toJSON() : JSON.parse(JSON.stringify(product));
  const images = sortImages((normalized.images || []).map((image) => normalizeImage(image, req)).filter((image) => image?.url));
  const thumbnail = images[0]?.url ?? null;

  normalized.images = images;
  normalized.thumbnail = thumbnail;
  normalized.title = normalized.name;
  normalized.price = normalized.sellingPrice;

  if (Array.isArray(normalized.variants)) {
    normalized.variants = normalized.variants.map((variant) => ({
      ...variant,
      variantImages: sortImages((variant.variantImages || []).map((image) => normalizeImage(image, req)).filter((image) => image?.url)),
    }));
  }

  return normalized;
}

function normalizeProducts(products, req) {
  return (products || []).map((product) => normalizeProduct(product, req));
}

function debugProductMedia(label, value) {
  if (process.env.NODE_ENV === 'production') return;
  console.log(`[product-media] ${label}`, JSON.stringify(value, null, 2));
}

module.exports = {
  debugProductMedia,
  getRequestOrigin,
  normalizeImage,
  normalizeImageUrl,
  normalizeProduct,
  normalizeProducts,
};
