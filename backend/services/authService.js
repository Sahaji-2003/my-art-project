
// ============================================
// services/authService.js
// ============================================
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  async registerUser(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isArtist: user.isArtist
    };
  }

  async loginUser(email, password) {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isArtist: user.isArtist,
      profilePicture: user.profilePicture
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(userId, updateData) {
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

  async verifyEmailForPasswordReset(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('No account found with this email address');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory (in production, use Redis or database)
    this.resetOTPs = this.resetOTPs || {};
    this.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    return { otp };
  }

  async verifyOTPAndResetPassword(email, otp, newPassword) {
    this.resetOTPs = this.resetOTPs || {};
    const resetData = this.resetOTPs[email];

    if (!resetData) {
      throw new Error('OTP not found or expired');
    }

    if (Date.now() > resetData.expiresAt) {
      delete this.resetOTPs[email];
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (resetData.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Update password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    await user.save();

    // Clean up OTP
    delete this.resetOTPs[email];

    return { success: true };
  }
}

module.exports = new AuthService();