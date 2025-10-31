

// ============================================
// services/artistService.js
// ============================================
const ArtistProfile = require('../models/ArtistProfile');
const User = require('../models/User');

class ArtistService {
  async createProfile(userId, profileData) {
    // Check if profile already exists
    const existingProfile = await ArtistProfile.findOne({ userId });
    
    if (existingProfile) {
      // Update existing profile
      const profile = await ArtistProfile.findOneAndUpdate(
        { userId },
        { $set: profileData },
        { new: true, runValidators: true }
      ).populate('userId', 'name email profilePicture');
      return profile;
    }

    // Create new artist profile
    const profile = await ArtistProfile.create({
      userId,
      ...profileData
    });

    // Update user's isArtist flag
    await User.findByIdAndUpdate(userId, { isArtist: true });

    return profile;
  }

  async getProfile(userId) {
    const profile = await ArtistProfile.findOne({ userId }).populate('userId', 'name email profilePicture');
    if (!profile) {
      throw new Error('Artist profile not found');
    }
    return profile;
  }

  async updateProfile(userId, updateData) {
    const profile = await ArtistProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'name email profilePicture');

    if (!profile) {
      throw new Error('Artist profile not found');
    }
    return profile;
  }

  async getAllArtists(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const artists = await ArtistProfile.find()
      .populate('userId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ArtistProfile.countDocuments();

    return {
      artists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getArtistStats(userId) {
    const profile = await ArtistProfile.findOne({ userId });
    if (!profile) {
      throw new Error('Artist profile not found');
    }

    return {
      totalSales: profile.totalSales,
      totalRevenue: profile.totalRevenue,
      rating: profile.rating
    };
  }
}

module.exports = new ArtistService();