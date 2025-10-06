// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);

// Notification routes (all protected)
router.get('/notifications', protect, getMyNotifications);
router.patch('/notifications/:notification_id/read', protect, markAsRead);
router.patch('/notifications/read-all', protect, markAllAsRead);
router.delete('/notifications/:notification_id', protect, deleteNotification);

module.exports = router;