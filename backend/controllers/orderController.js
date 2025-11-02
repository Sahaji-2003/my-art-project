
// ============================================
// controllers/orderController.js
// ============================================
const orderService = require('../services/orderService');

exports.createOrder = async (req, res, next) => {
  try {
    // Get artworkId from params or body
    const artworkId = req.params.artworkId || req.body.artworkId;
    
    const order = await orderService.createOrder(
      req.user.id,
      artworkId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Artwork purchased successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId, req.user.id);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

exports.getArtistOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getArtistOrders(req.user.id);
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      req.user.id,
      status,
      trackingNumber
    );
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};