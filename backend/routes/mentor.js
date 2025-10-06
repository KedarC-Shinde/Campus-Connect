// routes/mentor.js
const express = require('express');
const router = express.Router();
const {
  getPendingApplications,
  approveApplication,
  rejectApplication,
  getMyMentees
} = require('../controllers/mentorController');
const { protect, authorize } = require('../middleware/auth');

// All routes protected and only for mentors
router.use(protect);
router.use(authorize('mentor'));

router.get('/applications/pending', getPendingApplications);
router.get('/mentees', getMyMentees);
router.patch('/applications/:application_id/approve', approveApplication);
router.patch('/applications/:application_id/reject', rejectApplication);

module.exports = router;