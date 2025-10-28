
// ============================================
// routes/communityRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected

// Send connection request
router.post('/', protect, communityController.sendConnectionRequest);

// Get connection requests
router.get('/requests', protect, communityController.getConnectionRequests);

// Get connections
router.get('/connections', protect, communityController.getConnections);

// Update connection status
router.put('/:connectionId', protect, communityController.updateConnectionStatus);

// Delete connection
router.delete('/:connectionId', protect, communityController.deleteConnection);

module.exports = router;