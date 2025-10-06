// controllers/mentorController.js
const db = require('../config/db');
const { sendNotification } = require('../utils/notificationHelper');

// Get all pending applications for mentor's students
exports.getPendingApplications = async (req, res) => {
  try {
    const mentor_id = req.user.id;

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
        GROUP_CONCAT(DISTINCT ss.skill_name) as student_skills,
        i.title as internship_title,
        i.company_name,
        i.duration,
        i.stipend,
        i.location
      FROM applications a
      JOIN student_profiles sp ON a.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN internships i ON a.internship_id = i.id
      LEFT JOIN student_skills ss ON sp.id = ss.student_id
      WHERE sp.mentor_id = ? AND a.status = 'pending_mentor'
      GROUP BY a.id
      ORDER BY a.applied_at DESC
    `, [mentor_id]);

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Fetch pending applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications', message: error.message });
  }
};

// Approve an application
exports.approveApplication = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { mentor_remarks } = req.body;
    const mentor_id = req.user.id;

    // Verify this application belongs to mentor's student
    const [applications] = await db.query(`
      SELECT a.*, sp.user_id as student_user_id
      FROM applications a
      JOIN student_profiles sp ON a.student_id = sp.id
      WHERE a.id = ? AND sp.mentor_id = ? AND a.status = 'pending_mentor'
    `, [application_id, mentor_id]);

    if (applications.length === 0) {
      return res.status(404).json({ 
        error: 'Application not found or not pending approval' 
      });
    }

    // Update status to approved
    await db.query(
      'UPDATE applications SET status = "mentor_approved", mentor_remarks = ? WHERE id = ?',
      [mentor_remarks || 'Approved by mentor', application_id]
    );

    // Send notification to student
    await sendNotification(
      applications[0].student_user_id,
      'Application Approved by Mentor',
      'Your mentor has approved your application. It will now be reviewed by the TPO.',
      'success'
    );

    res.json({
      success: true,
      message: 'Application approved successfully'
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ error: 'Failed to approve application', message: error.message });
  }
};

// Reject an application
exports.rejectApplication = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { mentor_remarks } = req.body;
    const mentor_id = req.user.id;

    // Verify this application belongs to mentor's student
    const [applications] = await db.query(`
      SELECT a.*, sp.user_id as student_user_id
      FROM applications a
      JOIN student_profiles sp ON a.student_id = sp.id
      WHERE a.id = ? AND sp.mentor_id = ? AND a.status = 'pending_mentor'
    `, [application_id, mentor_id]);

    if (applications.length === 0) {
      return res.status(404).json({ 
        error: 'Application not found or not pending approval' 
      });
    }

    // Update status to rejected
    await db.query(
      'UPDATE applications SET status = "mentor_rejected", mentor_remarks = ? WHERE id = ?',
      [mentor_remarks || 'Rejected by mentor', application_id]
    );

    // Send notification to student
    await sendNotification(
      applications[0].student_user_id,
      'Application Not Approved',
      `Your mentor has reviewed your application. Remarks: ${mentor_remarks || 'Not approved at this time.'}`,
      'warning'
    );

    res.json({
      success: true,
      message: 'Application rejected'
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: 'Failed to reject application', message: error.message });
  }
};

// Get all mentees (students assigned to this mentor)
exports.getMyMentees = async (req, res) => {
  try {
    const mentor_id = req.user.id;

    const [mentees] = await db.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        sp.roll_number,
        sp.branch,
        sp.semester,
        sp.cgpa,
        sp.linkedin_url,
        sp.github_url,
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.id END) as selected_count
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN applications a ON sp.id = a.student_id
      WHERE sp.mentor_id = ?
      GROUP BY sp.id
      ORDER BY u.last_name, u.first_name
    `, [mentor_id]);

    res.json({
      success: true,
      count: mentees.length,
      mentees
    });
  } catch (error) {
    console.error('Fetch mentees error:', error);
    res.status(500).json({ error: 'Failed to fetch mentees', message: error.message });
  }
};

module.exports = exports;