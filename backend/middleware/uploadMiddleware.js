// ============================================
// middleware/uploadMiddleware.js
// ============================================
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Path to frontend public assets images directory
const artworkDir = path.join(__dirname, '../../frontend/public/assets/images/art');
const profileDir = path.join(__dirname, '../../frontend/public/userProfile');

// Ensure the upload directories exist
if (!fs.existsSync(artworkDir)) {
  fs.mkdirSync(artworkDir, { recursive: true });
}
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// Configure multer for disk storage - artwork images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, artworkDir);
  },
  filename: (req, file, cb) => {
    // Get user info from request if available
    const user = req.user;
    const artName = user && req.body.artName ? req.body.artName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'artwork';
    const username = user && user.name ? user.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'user';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    
    // Format: artname_username_unique.jpg
    cb(null, `${artName}_${username}_${uniqueSuffix}${ext}`);
  }
});

// Configure multer for disk storage - profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Artwork upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Profile picture upload middleware
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  }
});

// Middleware for single artwork image upload
const uploadSingle = upload.single('image');

// Middleware for multiple artwork image uploads
const uploadMultiple = upload.array('images', 4); // Max 4 images

// Middleware for profile picture upload
const uploadProfilePicture = profileUpload.single('profilePicture');

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadProfilePicture
};
