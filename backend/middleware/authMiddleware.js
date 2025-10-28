
// ============================================
// middleware/authMiddleware.js
// ============================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is an artist
exports.isArtist = async (req, res, next) => {
  try {
    if (!req.user.isArtist) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Artist profile required.'
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};