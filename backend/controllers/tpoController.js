// controllers/tpoController.js
const db = require('../config/db');
const { sendNotification } = require('../utils/notificationHelper');

// Post a new internship
exports.postInternship = async (req, res) => {
  try {
    const tpo_id = req.user.id;
    const {
      title,
      company_name,
      description,
      requirements,
      duration,
      stipend,
      location,
      work_mode,
      deadline,
      total_positions,
      required_skills,
      recruiter_id
    } = req.body;

    // Validate required fields
    if (!title || !company_name || !duration || !deadline) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Insert internship
    const [result] = await db.query(
      `INSERT INTO internships 
      (posted_by, recruiter_id, title, company_name, description, requirements, 
       duration, stipend, location, work_mode, deadline, total_positions, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [tpo_id, recruiter_id || null, title, company_name, description, requirements,
       duration, stipend, location, work_mode || 'on-site', deadline, total_positions || 1]
    );

    const internship_id = result.insertId;

    // Add required skills if provided
    if (required_skills && Array.isArray(required_skills)) {
      for (const skill of required_skills) {
        await db.query(
          'INSERT INTO internship_skills (internship_id, skill_name, is_mandatory) VALUES (?, ?, ?)',
          [internship_id, skill.name, skill.is_mandatory !== false]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Internship posted successfully',
      internship_id
    });
  } catch (error) {
    console.error('Post internship error:', error);
    res.status(500).json({ error: 'Failed to post internship', message: error.message });
  }
};

// Get all internships posted by TPO
exports.getAllInternships = async (req, res) => {
  try {
    const [internships] = await db.query(`
      SELECT 
        i.*,
        GROUP_CONCAT(DISTINCT is_skill.skill_name) as required_skills,
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT CASE WHEN a.status = 'pending_mentor' THEN a.id END) as pending_applications
      FROM internships i
      LEFT JOIN internship_skills is_skill ON i.id = is_skill.internship_id
      LEFT JOIN applications a ON i.id = a.internship_id
      GROUP BY i.id
      ORDER BY i.created_at DESC
    `);

    res.json({
      success: true,
      count: internships.length,
      internships
    });
  } catch (error) {
    console.error('Fetch internships error:', error);
    res.status(500).json({ error: 'Failed to fetch internships', message: error.message });
  }
};

// Get all applications for an internship
exports.getInternshipApplications = async (req, res) => {
  try {
    const { internship_id } = req.params;

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
        i.company_name
      FROM applications a
      JOIN student_profiles sp ON a.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN internships i ON a.internship_id = i.id
      LEFT JOIN student_skills ss ON sp.id = ss.student_id
      WHERE a.internship_id = ?
      GROUP BY a.id
      ORDER BY a.match_score DESC, a.applied_at DESC
    `, [internship_id]);

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

// Get all applications (all internships)
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // Optional filter by status

    let query = `
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        sp.roll_number,
        sp.branch,
        sp.cgpa,
        i.title as internship_title,
        i.company_name
      FROM applications a
      JOIN student_profiles sp ON a.student_id = sp.id
      JOIN users u ON sp.user_id = u.id
      JOIN internships i ON a.internship_id = i.id
    `;

    const params = [];
    if (status) {
      query += ' WHERE a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.applied_at DESC';

    const [applications] = await db.query(query, params);

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Fetch all applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications', message: error.message });
  }
};

// Forward application to recruiter (after mentor approval)
exports.forwardToRecruiter = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { tpo_remarks } = req.body;

    // Check if application exists and is mentor approved
    const [applications] = await db.query(
      `SELECT a.*, sp.user_id as student_user_id
       FROM applications a
       JOIN student_profiles sp ON a.student_id = sp.id
       WHERE a.id = ? AND a.status = "mentor_approved"`,
      [application_id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ 
        error: 'Application not found or not yet approved by mentor' 
      });
    }

    // Update status to forwarded
    await db.query(
      'UPDATE applications SET status = "tpo_forwarded", tpo_remarks = ? WHERE id = ?',
      [tpo_remarks, application_id]
    );

    // Send notification to student
    await sendNotification(
      applications[0].student_user_id,
      'Application Forwarded to Recruiter',
      'Your application has been forwarded to the recruiter. They will review it soon.',
      'info'
    );

    res.json({
      success: true,
      message: 'Application forwarded to recruiter successfully'
    });
  } catch (error) {
    console.error('Forward application error:', error);
    res.status(500).json({ error: 'Failed to forward application', message: error.message });
  }
};

// Get placement statistics/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Total internships
    const [totalInternships] = await db.query(
      'SELECT COUNT(*) as count FROM internships'
    );

    // Active internships
    const [activeInternships] = await db.query(
      'SELECT COUNT(*) as count FROM internships WHERE status = "active" AND deadline >= CURDATE()'
    );

    // Total applications
    const [totalApplications] = await db.query(
      'SELECT COUNT(*) as count FROM applications'
    );

    // Applications by status
    const [applicationsByStatus] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status
    `);

    // Top companies
    const [topCompanies] = await db.query(`
      SELECT company_name, COUNT(*) as internship_count
      FROM internships
      GROUP BY company_name
      ORDER BY internship_count DESC
      LIMIT 5
    `);

    // Applications over time (last 7 days)
    const [applicationsOverTime] = await db.query(`
      SELECT DATE(applied_at) as date, COUNT(*) as count
      FROM applications
      WHERE applied_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(applied_at)
      ORDER BY date
    `);

    // Placement rate (selected / total applications)
    const [placementRate] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'selected' THEN 1 ELSE 0 END) as selected
      FROM applications
    `);

    const rate = placementRate[0].total > 0 
      ? Math.round((placementRate[0].selected / placementRate[0].total) * 100)
      : 0;

    res.json({
      success: true,
      analytics: {
        total_internships: totalInternships[0].count,
        active_internships: activeInternships[0].count,
        total_applications: totalApplications[0].count,
        applications_by_status: applicationsByStatus,
        top_companies: topCompanies,
        applications_over_time: applicationsOverTime,
        placement_rate: rate
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics', message: error.message });
  }
};

// Update internship status (close/reopen)
exports.updateInternshipStatus = async (req, res) => {
  try {
    const { internship_id } = req.params;
    const { status } = req.body;

    if (!['active', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.query(
      'UPDATE internships SET status = ? WHERE id = ?',
      [status, internship_id]
    );

    res.json({
      success: true,
      message: `Internship ${status} successfully`
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
};

module.exports = exports;