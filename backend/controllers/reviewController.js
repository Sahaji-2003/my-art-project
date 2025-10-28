

// ============================================
// controllers/reviewController.js
// ============================================
const reviewService = require('../services/reviewService');

exports.createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;
    const review = await reviewService.createReview(req.user.id, orderId, {
      rating,
      comment
    });
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

exports.getArtworkReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getArtworkReviews(req.params.artworkId);
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.params.reviewId,
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.reviewId, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};