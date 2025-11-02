

// ============================================
// routes/orderRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected

// Purchase artwork
router.post('/', protect, orderController.createOrder);
router.post('/:artworkId/purchase', protect, orderController.createOrder);

// Get user's orders (as buyer)
router.get('/user', protect, orderController.getUserOrders);
router.get('/my-orders', protect, orderController.getUserOrders);

// Get artist's orders (as seller)
router.get('/artist-orders', protect, orderController.getArtistOrders);

// Get single order
router.get('/:orderId', protect, orderController.getOrder);

// Update order status (artist only)
router.put('/:orderId/status', protect, orderController.updateOrderStatus);

module.exports = router;