

// ============================================
// routes/artworkRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// Search artworks (public)
router.get('/search', artworkController.searchArtwork);

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

// Upload artwork image (protected)
router.post('/upload-image', protect, uploadSingle, artworkController.uploadImage);

module.exports = router;