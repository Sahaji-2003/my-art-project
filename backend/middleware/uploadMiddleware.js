// ============================================
// middleware/uploadMiddleware.js
// ============================================
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for now

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware for single image upload
const uploadSingle = upload.single('image');

// Middleware for multiple image uploads
const uploadMultiple = upload.array('images', 10); // Max 10 images

module.exports = {
  uploadSingle,
  uploadMultiple
};
