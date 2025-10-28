
// ============================================
// controllers/artworkController.js
// ============================================
const artworkService = require('../services/artworkService');

exports.createArtwork = async (req, res, next) => {
  try {
    const artwork = await artworkService.createArtwork(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Artwork uploaded successfully',
      data: artwork
    });
  } catch (error) {
    next(error);
  }
};

exports.getArtwork = async (req, res, next) => {
  try {
    const artwork = await artworkService.getArtworkById(req.params.artworkId);
    res.status(200).json({
      success: true,
      data: artwork
    });
  } catch (error) {
    next(error);
  }
};

exports.updateArtwork = async (req, res, next) => {
  try {
    const artwork = await artworkService.updateArtwork(
      req.params.artworkId,
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Artwork updated successfully',
      data: artwork
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.deleteArtwork(req.params.artworkId, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

exports.searchArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.searchArtwork(req.query);
    res.status(200).json({
      success: true,
      data: result.artworks,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const result = await artworkService.toggleLike(req.params.artworkId, req.user.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
