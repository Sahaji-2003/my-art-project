
// ============================================
// services/artistService.js
// ============================================
const User = require('../models/User');

class ArtistService {
  async createProfile(userId, profileData) {
    // Update user with artist profile data and set isArtist to true
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          ...profileData,
          isArtist: true 
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isArtist) {
      throw new Error('User is not an artist');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllArtists(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const artists = await User.find({ isArtist: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isArtist: true });

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
    const user = await User.findById(userId).select('-password');
    if (!user || !user.isArtist) {
      throw new Error('Artist not found');
    }

    return {
      totalSales: user.totalSales || 0,
      totalRevenue: user.totalRevenue || 0,
      rating: user.rating || 0
    };
  }
}

module.exports = new ArtistService();