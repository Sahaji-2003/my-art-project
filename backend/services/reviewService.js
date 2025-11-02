

// ============================================
// services/reviewService.js
// ============================================
const Review = require('../models/Review');
const Order = require('../models/Order');

class ReviewService {
  async createReview(buyerId, orderId, reviewData) {
    // Verify order exists and belongs to buyer
    const order = await Order.findOne({ _id: orderId, buyerId });
    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId, buyerId });
    if (existingReview) {
      throw new Error('Review already exists for this order');
    }

    // Allow reviews right after purchase (removed delivered status requirement)
    const review = await Review.create({
      artworkId: order.artworkId,
      buyerId,
      orderId,
      ...reviewData
    });

    // Populate the buyerId field after creation
    await review.populate('buyerId', 'name profilePicture');

    return review;
  }

  async getArtworkReviews(artworkId) {
    const reviews = await Review.find({ artworkId })
      .populate('buyerId', 'name profilePicture')
      .sort({ createdAt: -1 });

    return reviews;
  }

  async updateReview(reviewId, buyerId, updateData) {
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, buyerId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!review) {
      throw new Error('Review not found or unauthorized');
    }

    return review;
  }

  async deleteReview(reviewId, buyerId) {
    const review = await Review.findOneAndDelete({ _id: reviewId, buyerId });
    if (!review) {
      throw new Error('Review not found or unauthorized');
    }
    return { message: 'Review deleted successfully' };
  }

  async checkReviewExists(orderId, buyerId) {
    const review = await Review.findOne({ orderId, buyerId })
      .populate('buyerId', 'name profilePicture');
    return review;
  }

  async getOrderReview(orderId, buyerId) {
    const review = await Review.findOne({ orderId, buyerId })
      .populate('buyerId', 'name profilePicture');
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  }

  async getArtistReviews(artistId, limit = 5) {
    const Artwork = require('../models/Artwork');
    
    // Get all artwork IDs for this artist
    const artworks = await Artwork.find({ artistId }, { _id: 1 });
    const artworkIds = artworks.map(art => art._id);
    
    if (artworkIds.length === 0) {
      return { reviews: [], total: 0 };
    }
    
    // Get all reviews for these artworks, sorted by most recent
    const allReviews = await Review.find({ artworkId: { $in: artworkIds } })
      .populate('buyerId', 'name profilePicture')
      .populate('artworkId', 'title images')
      .sort({ createdAt: -1 });
    
    // Get top reviews (limited)
    const topReviews = limit > 0 ? allReviews.slice(0, limit) : allReviews;
    
    return {
      reviews: topReviews,
      total: allReviews.length
    };
  }
}

module.exports = new ReviewService();