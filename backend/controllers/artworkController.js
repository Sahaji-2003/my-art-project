
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

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // For now, we'll return a mock URL since we don't have file storage set up
    // In a real application, you would upload to AWS S3, Cloudinary, or similar
    const imageUrl = `https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Uploaded+Image`;
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
};