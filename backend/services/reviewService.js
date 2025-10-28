

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

    if (order.orderStatus !== 'delivered') {
      throw new Error('Can only review after order is delivered');
    }

    const review = await Review.create({
      artworkId: order.artworkId,
      buyerId,
      orderId,
      ...reviewData
    });

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
}

module.exports = new ReviewService();