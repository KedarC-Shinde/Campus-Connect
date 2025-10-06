// controllers/notificationController.js
const db = require('../config/db');

// Get all notifications for logged-in user
exports.getMyNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [notifications] = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [user_id]
    );

    const unread_count = notifications.filter(n => !n.is_read).length;

    res.json({
      success: true,
      count: notifications.length,
      unread_count,
      notifications
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notifications', 
      message: error.message 
    });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const user_id = req.user.id;

    // Verify notification belongs to user
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [notification_id, user_id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await db.query(
      'UPDATE notifications SET is_read = true WHERE id = ?',
      [notification_id]
    );

    res.json({ 
      success: true, 
      message: 'Notification marked as read' 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ 
      error: 'Failed to update notification', 
      message: error.message 
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false',
      [user_id]
    );

    res.json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ 
      error: 'Failed to update notifications', 
      message: error.message 
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const user_id = req.user.id;

    await db.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notification_id, user_id]
    );

    res.json({ 
      success: true, 
      message: 'Notification deleted' 
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ 
      error: 'Failed to delete notification', 
      message: error.message 
    });
  }
};

module.exports = exports;