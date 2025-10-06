// routes/recruiter.js
const express = require('express');
const router = express.Router();
const {
  getApplications,
  scheduleInterview,
  updateApplicationStatus,
  issueCertificate
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('recruiter'));

router.get('/applications', getApplications);
router.post('/applications/:application_id/interview', scheduleInterview);
router.patch('/applications/:application_id/status', updateApplicationStatus);
router.post('/applications/:application_id/certificate', issueCertificate);

module.exports = router;