

// ============================================
// routes/artistRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfilePicture } = require('../middleware/uploadMiddleware');

// Create or update artist profile
router.post('/profile', protect, artistController.createProfile);

// Get artist profile (own or by userId)
router.get('/profile', protect, artistController.getProfile);
router.get('/profile/:userId', artistController.getProfile);

// Update artist profile
router.put('/profile', protect, artistController.updateProfile);

// Upload profile picture
router.post('/upload-profile-picture', protect, uploadProfilePicture, artistController.uploadProfilePicture);

// Get all artists
router.get('/', artistController.getAllArtists);

// Get artist inventory
router.get('/inventory', protect, artistController.getInventory);

// Get artist stats
router.get('/stats', protect, artistController.getStats);

module.exports = router;