// routes/tpo.js
const express = require('express');
const router = express.Router();
const {
  postInternship,
  getAllInternships,
  getInternshipApplications,
  getAllApplications,
  forwardToRecruiter,
  getAnalytics,
  updateInternshipStatus
} = require('../controllers/tpoController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and only for TPO
router.use(protect);
router.use(authorize('tpo'));

// Internship routes
router.post('/internships', postInternship);
router.get('/internships', getAllInternships);
router.get('/internships/:internship_id/applications', getInternshipApplications);
router.patch('/internships/:internship_id/status', updateInternshipStatus);

// Application routes
router.get('/applications', getAllApplications);
router.patch('/applications/:application_id/forward', forwardToRecruiter);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;