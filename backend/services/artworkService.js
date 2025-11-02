

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

    // Clean up dimensions - remove undefined values
    if (artworkData.dimensions) {
      Object.keys(artworkData.dimensions).forEach(key => {
        if (artworkData.dimensions[key] === undefined || artworkData.dimensions[key] === '') {
          delete artworkData.dimensions[key];
        }
      });
      
      // If only unit exists, make sure it's valid
      if (Object.keys(artworkData.dimensions).length === 1 && artworkData.dimensions.unit) {
        // Keep dimensions object with just unit if that's all we have
      }
    }

    // Ensure images array is not empty
    if (!artworkData.images || artworkData.images.length === 0) {
      throw new Error('At least one image is required');
    }

    console.log('Creating artwork with cleaned data:', {
      artistId,
      artworkData: JSON.stringify(artworkData, null, 2)
    });

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

    // Build match query
    const matchQuery = { status: 'available' };
    if (medium) matchQuery.medium = medium;
    if (style) matchQuery.style = style;
    if (price_min || price_max) {
      matchQuery.price = {};
      if (price_min) matchQuery.price.$gte = parseFloat(price_min);
      if (price_max) matchQuery.price.$lte = parseFloat(price_max);
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: 'users',
          localField: 'artistId',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      {
        $unwind: {
          path: '$artistInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          artist: {
            _id: '$artistInfo._id',
            name: '$artistInfo.name',
            email: '$artistInfo.email',
            profilePicture: '$artistInfo.profilePicture'
          },
          // Add searchable fields for text search
          searchableText: {
            $concat: [
              { $ifNull: ['$title', ''] },
              ' ',
              { $ifNull: ['$description', ''] },
              ' ',
              { $ifNull: [{ $reduce: { input: '$tags', initialValue: '', in: { $concat: ['$$value', ' ', '$$this'] } } }, ''] },
              ' ',
              { $ifNull: ['$artistInfo.name', ''] }
            ]
          }
        }
      }
    ];

    // Add text search filter if query exists
    if (q && q.trim()) {
      pipeline.push({
        $match: {
          searchableText: { $regex: q.trim(), $options: 'i' }
        }
      });
    }

    // Add sorting
    pipeline.push({ $sort: { createdAt: -1 } });

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Artwork.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

    // Project final fields
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        price: 1,
        medium: 1,
        style: 1,
        images: 1,
        dimensions: 1,
        status: 1,
        tags: 1,
        views: 1,
        likes: 1,
        createdAt: 1,
        updatedAt: 1,
        artistId: 1,
        artist: 1
      }
    });

    const artworks = await Artwork.aggregate(pipeline);

    return {
      artworks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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

  async getTrendingArtworks(limit = 8) {
    // Fetch more artworks to ensure good sorting
    const artworks = await Artwork.find({ status: 'available' })
      .populate('artistId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .limit(Math.max(parseInt(limit) * 2, 20));

    // Sort by likes count in JavaScript since MongoDB doesn't support array length in sort
    const sortedArtworks = artworks.sort((a, b) => {
      const aLikes = a.likes ? a.likes.length : 0;
      const bLikes = b.likes ? b.likes.length : 0;
      if (aLikes !== bLikes) {
        return bLikes - aLikes;
      }
      return (b.views || 0) - (a.views || 0);
    });

    return sortedArtworks.slice(0, limit);
  }
}

module.exports = new ArtworkService();