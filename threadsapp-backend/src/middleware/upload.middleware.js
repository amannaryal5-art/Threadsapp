const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
);

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'threadsapp',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      },
    })
  : multer.diskStorage({
      destination: (_req, _file, callback) => {
        callback(null, uploadsDir);
      },
      filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname) || '.jpg';
        const baseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9-_]/g, '-');
        callback(null, `${Date.now()}-${baseName}${extension}`);
      },
    });

module.exports = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
