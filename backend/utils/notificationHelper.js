// utils/notificationHelper.js
const db = require('../config/db');

// Send notification to a user
const sendNotification = async (user_id, title, message, type = 'info') => {
  try {
    await db.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [user_id, title, message, type]
    );
    console.log(`✅ Notification sent to user ${user_id}: ${title}`);
  } catch (error) {
    console.error('❌ Send notification error:', error);
  }
};

module.exports = { sendNotification };