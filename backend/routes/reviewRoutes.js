

// ============================================
// routes/reviewRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get artwork reviews (public)
router.get('/artwork/:artworkId', reviewController.getArtworkReviews);

// Create review (protected)
router.post('/', protect, reviewController.createReview);

// Update review (protected)
router.put('/:reviewId', protect, reviewController.updateReview);

// Delete review (protected)
router.delete('/:reviewId', protect, reviewController.deleteReview);

module.exports = router;
