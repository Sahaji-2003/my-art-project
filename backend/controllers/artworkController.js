
// ============================================
// controllers/artworkController.js
// ============================================
const artworkService = require('../services/artworkService');

exports.createArtwork = async (req, res, next) => {
  try {
    console.log('Creating artwork with data:', {
      artistId: req.user.id,
      artworkData: JSON.stringify(req.body, null, 2)
    });
    
    const artwork = await artworkService.createArtwork(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Artwork uploaded successfully',
      data: artwork
    });
  } catch (error) {
    console.error('Error in createArtwork controller:', error);
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

    // Return the URL path relative to the frontend public directory
    // The file is saved in frontend/public/assets/images, so the URL is /assets/images/filename
    const imageUrl = `/assets/images/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
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