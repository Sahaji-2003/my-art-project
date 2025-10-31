
// ============================================
// controllers/artistController.js
// ============================================
const artistService = require('../services/artistService');
const ArtistProfile = require('../models/ArtistProfile');

exports.createProfile = async (req, res, next) => {
  try {
    // Check if profile exists first
    const existingProfile = await ArtistProfile.findOne({ userId: req.user.id });
    
    const profile = await artistService.createProfile(req.user.id, req.body);
    
    const message = existingProfile ? 'Artist profile updated successfully' : 'Artist profile created successfully';
    res.status(existingProfile ? 200 : 201).json({
      success: true,
      message,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    const profile = await artistService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await artistService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Artist profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllArtists = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await artistService.getAllArtists(page, limit);
    res.status(200).json({
      success: true,
      data: result.artists,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getInventory = async (req, res, next) => {
  try {
    const artworkService = require('../services/artworkService');
    const artworks = await artworkService.getArtistInventory(req.user.id);
    res.status(200).json({
      success: true,
      data: { artworks }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await artistService.getArtistStats(req.user.id);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the URL path relative to the frontend public directory
    // The file is saved in frontend/public/userProfile, so the URL is /userProfile/filename
    const imageUrl = `/userProfile/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
};