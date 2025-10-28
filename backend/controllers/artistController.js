
// ============================================
// controllers/artistController.js
// ============================================
const artistService = require('../services/artistService');

exports.createProfile = async (req, res, next) => {
  try {
    const profile = await artistService.createProfile(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Artist profile created successfully',
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
