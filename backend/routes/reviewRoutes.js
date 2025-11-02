

// ============================================
// routes/reviewRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get artwork reviews (public)
router.get('/artwork/:artworkId', reviewController.getArtworkReviews);

// Get all reviews for artist's artworks (public)
router.get('/artist/:artistId', reviewController.getArtistReviews);

// Check if review exists for an order (protected)
router.get('/check/:orderId', protect, reviewController.checkReviewExists);

// Get review for an order (protected)
router.get('/order/:orderId/review', protect, reviewController.getOrderReview);

// Create review (protected)
router.post('/', protect, reviewController.createReview);

// Update review (protected)
router.put('/:reviewId', protect, reviewController.updateReview);

// Delete review (protected)
router.delete('/:reviewId', protect, reviewController.deleteReview);

module.exports = router;
