// ============================================
// controllers/authController.js
// ============================================
const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    
    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const user = await authService.loginUser(email, password);
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateUser(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.verifyEmailForPasswordReset(email);
    res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.verifyOTPAndResetPassword(email, otp, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};