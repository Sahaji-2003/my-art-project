

// ============================================
// services/communityService.js
// ============================================
const Community = require('../models/Community');

class CommunityService {
  async sendConnectionRequest(senderId, receiverId, connectionData) {
    // Check if connection already exists
    const existingConnection = await Community.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existingConnection) {
      throw new Error('Connection request already exists');
    }

    const connection = await Community.create({
      senderId,
      receiverId,
      ...connectionData
    });

    return connection;
  }

  async getConnectionRequests(userId) {
    const requests = await Community.find({
      receiverId: userId,
      status: 'pending'
    }).populate('senderId', 'name email profilePicture');

    return requests;
  }

  async getConnections(userId) {
    const connections = await Community.find({
      $or: [
        { senderId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' }
      ]
    })
    .populate('senderId', 'name email profilePicture')
    .populate('receiverId', 'name email profilePicture');

    return connections;
  }

  async updateConnectionStatus(connectionId, receiverId, status) {
    const connection = await Community.findOneAndUpdate(
      { _id: connectionId, receiverId },
      { $set: { status } },
      { new: true }
    )
    .populate('senderId', 'name email profilePicture')
    .populate('receiverId', 'name email profilePicture');

    if (!connection) {
      throw new Error('Connection request not found or unauthorized');
    }

    return connection;
  }

  async deleteConnection(connectionId, userId) {
    const connection = await Community.findOneAndDelete({
      _id: connectionId,
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    if (!connection) {
      throw new Error('Connection not found or unauthorized');
    }

    return { message: 'Connection deleted successfully' };
  }
}

module.exports = new CommunityService();