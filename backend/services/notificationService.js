

// ============================================
// services/notificationService.js
// ============================================
const Notification = require('../models/Notification');

class NotificationService {
  async createNotification(notificationData) {
    const notification = await Notification.create(notificationData);
    return notification;
  }

  async getUserNotifications(userId, unreadOnly = false) {
    const query = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return notifications;
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return { message: 'Notification deleted successfully' };
  }
}

module.exports = new NotificationService();