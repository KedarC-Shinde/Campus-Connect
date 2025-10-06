// routes/student.js
const express = require('express');
const router = express.Router();
const {
  getAllInternships,
  applyToInternship,
  getMyApplications,
  updateProfile,
  getMyProfile
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and only for students
router.use(protect);
router.use(authorize('student'));

// GET routes
router.get('/internships', getAllInternships);
router.get('/applications', getMyApplications);
router.get('/profile', getMyProfile);

// POST/PUT routes
router.post('/apply', applyToInternship);
router.put('/profile', updateProfile);

module.exports = router;