

// ============================================
// services/orderService.js
// ============================================
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const ArtistProfile = require('../models/ArtistProfile');

class OrderService {
  async createOrder(buyerId, artworkId, orderData) {
    const { shipping_address, payment_method } = orderData;

    // Get artwork details
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    if (artwork.status !== 'available') {
      throw new Error('Artwork is not available for purchase');
    }

    // Parse shipping address
    const addressParts = shipping_address.split(',').map(part => part.trim());
    const shippingAddress = {
      street: addressParts[0] || '',
      city: addressParts[1] || '',
      state: addressParts[2] || '',
      country: addressParts[3] || '',
      zipCode: addressParts[4] || ''
    };

    // Create order
    const order = await Order.create({
      buyerId,
      artworkId,
      artistId: artwork.artistId,
      price: artwork.price,
      shippingAddress,
      paymentMethod: payment_method,
      paymentStatus: 'completed',
      orderStatus: 'confirmed'
    });

    // Update artwork status
    artwork.status = 'sold';
    await artwork.save();

    // Update artist statistics
    await ArtistProfile.findOneAndUpdate(
      { userId: artwork.artistId },
      {
        $inc: {
          totalSales: 1,
          totalRevenue: artwork.price
        }
      }
    );

    return order;
  }

  async getOrderById(orderId, userId) {
    const order = await Order.findById(orderId)
      .populate('buyerId', 'name email')
      .populate('artistId', 'name email')
      .populate('artworkId');

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if user is authorized to view this order
    if (order.buyerId._id.toString() !== userId && order.artistId._id.toString() !== userId) {
      throw new Error('Unauthorized to view this order');
    }

    return order;
  }

  async getUserOrders(userId) {
    const orders = await Order.find({ buyerId: userId })
      .populate('artworkId')
      .populate('artistId', 'name email')
      .sort({ createdAt: -1 });

    return orders;
  }

  async getArtistOrders(artistId) {
    const orders = await Order.find({ artistId })
      .populate('artworkId')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });

    return orders;
  }

  async updateOrderStatus(orderId, artistId, status, trackingNumber = null) {
    const updateData = { orderStatus: status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, artistId },
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    return order;
  }
}

module.exports = new OrderService();