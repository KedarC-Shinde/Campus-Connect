// controllers/recruiterController.js
const db = require('../config/db');
const { sendNotification } = require('../utils/notificationHelper');

// Get all applications forwarded to recruiter
exports.getApplications = async (req, res) => {
  try {
    const recruiter_id = req.user.id;

    const [applications] = await db.query(`
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        sp.roll_number,
        sp.branch,
        sp.semester,
        sp.cgpa,
        sp.resume_url,
        sp.linkedin_url,
        sp.github_url,
        GROUP_CONCAT(DISTINCT ss.skill_name) as student_skills,
        i.title as internship_title,
        i.company_name,
        i.duration,
        i.stipend
      FROM applications a
      JOIN student_profiles sp ON a.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN internships i ON a.internship_id = i.id
      LEFT JOIN student_skills ss ON sp.id = ss.student_id
      WHERE i.recruiter_id = ? AND a.status IN ('tpo_forwarded', 'interview_scheduled', 'selected', 'rejected')
      GROUP BY a.id
      ORDER BY a.updated_at DESC
    `, [recruiter_id]);

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications', message: error.message });
  }
};

// Schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { interview_date, interview_mode, meeting_link, location, interviewer_name } = req.body;

    if (!interview_date) {
      return res.status(400).json({ error: 'Interview date is required' });
    }

    // Get student user_id
    const [student] = await db.query(
      `SELECT sp.user_id 
       FROM applications a 
       JOIN student_profiles sp ON a.student_id = sp.id 
       WHERE a.id = ?`,
      [application_id]
    );

    // Update application status
    await db.query(
      'UPDATE applications SET status = "interview_scheduled" WHERE id = ?',
      [application_id]
    );

    // Insert interview record
    await db.query(
      `INSERT INTO interviews 
       (application_id, interview_date, interview_mode, meeting_link, location, interviewer_name) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [application_id, interview_date, interview_mode || 'online', meeting_link, location, interviewer_name]
    );

    // Send notification to student
    await sendNotification(
      student[0].user_id,
      'Interview Scheduled',
      `Your interview has been scheduled for ${interview_date}. ${interview_mode === 'online' ? 'Meeting link: ' + meeting_link : 'Location: ' + location}`,
      'info'
    );

    res.json({
      success: true,
      message: 'Interview scheduled successfully'
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({ error: 'Failed to schedule interview', message: error.message });
  }
};

// Update application status (select/reject)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { status, recruiter_remarks } = req.body;

    if (!['selected', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get student user_id
    const [student] = await db.query(
      `SELECT sp.user_id 
       FROM applications a 
       JOIN student_profiles sp ON a.student_id = sp.id 
       WHERE a.id = ?`,
      [application_id]
    );

    await db.query(
      'UPDATE applications SET status = ?, recruiter_remarks = ? WHERE id = ?',
      [status, recruiter_remarks, application_id]
    );

    // Send notification to student
    if (status === 'selected') {
      await sendNotification(
        student[0].user_id,
        'Congratulations! You have been selected',
        `You have been selected for the internship. ${recruiter_remarks || ''}`,
        'success'
      );
    } else {
      await sendNotification(
        student[0].user_id,
        'Application Status Update',
        `Your application was not selected. ${recruiter_remarks || 'Thank you for your interest.'}`,
        'warning'
      );
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
};

// Issue certificate
exports.issueCertificate = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { completion_date, performance_rating, supervisor_feedback } = req.body;

    // Generate unique certificate number
    const certificate_number = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await db.query(
      `INSERT INTO certificates 
       (application_id, certificate_number, issue_date, completion_date, performance_rating, supervisor_feedback, is_verified) 
       VALUES (?, ?, CURDATE(), ?, ?, ?, true)`,
      [application_id, certificate_number, completion_date, performance_rating, supervisor_feedback]
    );

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      certificate_number
    });
  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({ error: 'Failed to issue certificate', message: error.message });
  }
};

module.exports = exports;