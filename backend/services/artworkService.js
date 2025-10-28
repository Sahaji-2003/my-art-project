

// ============================================
// services/artworkService.js
// ============================================
const Artwork = require('../models/Artwork');
const ArtistProfile = require('../models/ArtistProfile');

class ArtworkService {
  async createArtwork(artistId, artworkData) {
    // Verify artist profile exists
    const artistProfile = await ArtistProfile.findOne({ userId: artistId });
    if (!artistProfile) {
      throw new Error('Artist profile not found. Please create an artist profile first.');
    }

    const artwork = await Artwork.create({
      artistId,
      ...artworkData
    });

    return artwork;
  }

  async getArtworkById(artworkId) {
    const artwork = await Artwork.findById(artworkId)
      .populate('artistId', 'name email profilePicture');
    
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // Increment views
    artwork.views += 1;
    await artwork.save();

    return artwork;
  }

  async updateArtwork(artworkId, artistId, updateData) {
    const artwork = await Artwork.findOneAndUpdate(
      { _id: artworkId, artistId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('artistId', 'name email profilePicture');

    if (!artwork) {
      throw new Error('Artwork not found or unauthorized');
    }
    return artwork;
  }

  async deleteArtwork(artworkId, artistId) {
    const artwork = await Artwork.findOneAndDelete({ _id: artworkId, artistId });
    if (!artwork) {
      throw new Error('Artwork not found or unauthorized');
    }
    return { message: 'Artwork deleted successfully' };
  }

  async searchArtwork(filters) {
    const { q, medium, style, price_min, price_max, page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    let query = { status: 'available' };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Filter by medium
    if (medium) {
      query.medium = medium;
    }

    // Filter by style
    if (style) {
      query.style = style;
    }

    // Filter by price range
    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = parseFloat(price_min);
      if (price_max) query.price.$lte = parseFloat(price_max);
    }

    const artworks = await Artwork.find(query)
      .populate('artistId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Artwork.countDocuments(query);

    return {
      artworks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getArtistInventory(artistId) {
    const artworks = await Artwork.find({ artistId })
      .sort({ createdAt: -1 });
    
    return artworks;
  }

  async toggleLike(artworkId, userId) {
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    const likeIndex = artwork.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      artwork.likes.splice(likeIndex, 1);
    } else {
      // Like
      artwork.likes.push(userId);
    }

    await artwork.save();
    return { likes: artwork.likes.length, isLiked: likeIndex === -1 };
  }
}

module.exports = new ArtworkService();