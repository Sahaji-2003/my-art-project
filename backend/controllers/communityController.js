

// ============================================
// controllers/communityController.js
// ============================================
const communityService = require('../services/communityService');

exports.sendConnectionRequest = async (req, res, next) => {
  try {
    const { user_id, connectionType, message } = req.body;
    const connection = await communityService.sendConnectionRequest(
      req.user.id,
      user_id,
      { connectionType, message }
    );
    res.status(200).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    next(error);
  }
};

exports.getConnectionRequests = async (req, res, next) => {
  try {
    const requests = await communityService.getConnectionRequests(req.user.id);
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

exports.getConnections = async (req, res, next) => {
  try {
    const connections = await communityService.getConnections(req.user.id);
    res.status(200).json({
      success: true,
      data: connections
    });
  } catch (error) {
    next(error);
  }
};

exports.updateConnectionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const connection = await communityService.updateConnectionStatus(
      req.params.connectionId,
      req.user.id,
      status
    );
    res.status(200).json({
      success: true,
      message: `Connection ${status}`,
      data: connection
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteConnection = async (req, res, next) => {
  try {
    const result = await communityService.deleteConnection(
      req.params.connectionId,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};