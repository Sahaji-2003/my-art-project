

// ============================================
// routes/artworkRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle, uploadMultiple } = require('../middleware/uploadMiddleware');

// Search artworks (public)
router.get('/search', artworkController.searchArtwork);

// Get trending artworks (public)
router.get('/trending', artworkController.getTrendingArtworks);

// Get artworks by artist (public)
router.get('/artists/:artistId/artworks', artworkController.getArtworksByArtist);

// Get single artwork (public)
router.get('/:artworkId', artworkController.getArtwork);

// Create artwork (protected)
router.post('/', protect, artworkController.createArtwork);

// Update artwork (protected)
router.put('/:artworkId', protect, artworkController.updateArtwork);

// Delete artwork (protected)
router.delete('/:artworkId', protect, artworkController.deleteArtwork);

// Like/Unlike artwork (protected)
router.post('/:artworkId/like', protect, artworkController.toggleLike);

// Upload artwork image(s) - supports both single and multiple (protected)
// Use uploadMultiple for multiple images (up to 4), uploadSingle for single
router.post('/upload-image', protect, uploadMultiple, artworkController.uploadImage);

module.exports = router;