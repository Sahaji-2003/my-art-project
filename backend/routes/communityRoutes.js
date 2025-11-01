
// ============================================
// routes/communityRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected

// Post/Discussion routes (must come before dynamic connection routes)
// Create post
router.post('/posts', protect, postController.createPost);

// Get all posts
router.get('/posts', protect, postController.getAllPosts);

// Get single post
router.get('/posts/:postId', protect, postController.getPost);

// Update post
router.put('/posts/:postId', protect, postController.updatePost);

// Delete post
router.delete('/posts/:postId', protect, postController.deletePost);

// Like/Unlike post
router.post('/posts/:postId/like', protect, postController.toggleLike);

// Get comments for post
router.get('/posts/:postId/comments', protect, postController.getComments);

// Add comment to post
router.post('/posts/:postId/comments', protect, postController.addComment);

// Like/Unlike comment
router.post('/comments/:commentId/like', protect, postController.toggleCommentLike);

// Delete comment
router.delete('/comments/:commentId', protect, postController.deleteComment);

// Connection routes (must come after specific routes)
// Get connection requests
router.get('/requests', protect, communityController.getConnectionRequests);

// Get connections
router.get('/connections', protect, communityController.getConnections);

// Send connection request
router.post('/connections', protect, communityController.sendConnectionRequest);

// Update connection status
router.put('/connections/:connectionId', protect, communityController.updateConnectionStatus);

// Delete connection
router.delete('/connections/:connectionId', protect, communityController.deleteConnection);

module.exports = router;