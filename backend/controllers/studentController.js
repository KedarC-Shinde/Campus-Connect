// controllers/studentController.js
const db = require('../config/db');
const { sendNotification } = require('../utils/notificationHelper');

// Get all active internships
exports.getAllInternships = async (req, res) => {
  try {
    const [internships] = await db.query(`
      SELECT 
        i.*,
        GROUP_CONCAT(DISTINCT is_skill.skill_name) as required_skills
      FROM internships i
      LEFT JOIN internship_skills is_skill ON i.id = is_skill.internship_id
      WHERE i.status = 'active' AND i.deadline >= CURDATE()
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

// Apply to an internship
exports.applyToInternship = async (req, res) => {
  try {
    const { internship_id, cover_letter } = req.body;
    const student_id = req.user.id;

    // Check if internship exists and is active
    const [internships] = await db.query(
      'SELECT * FROM internships WHERE id = ? AND status = "active" AND deadline >= CURDATE()',
      [internship_id]
    );

    if (internships.length === 0) {
      return res.status(404).json({ error: 'Internship not found or expired' });
    }

    // Get student profile
    const [studentProfiles] = await db.query(
      'SELECT id FROM student_profiles WHERE user_id = ?',
      [student_id]
    );

    if (studentProfiles.length === 0) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    const student_profile_id = studentProfiles[0].id;

    // Check if already applied
    const [existing] = await db.query(
      'SELECT * FROM applications WHERE student_id = ? AND internship_id = ?',
      [student_profile_id, internship_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'You have already applied to this internship' });
    }

    // Calculate match score
    const match_score = await calculateMatchScore(student_profile_id, internship_id);

    // Create application
    const [result] = await db.query(
      'INSERT INTO applications (student_id, internship_id, cover_letter, match_score, status) VALUES (?, ?, ?, ?, "pending_mentor")',
      [student_profile_id, internship_id, cover_letter, match_score]
    );

    // Send notification to student
    await sendNotification(
      student_id,
      'Application Submitted',
      `Your application for "${internships[0].title}" at ${internships[0].company_name} has been submitted successfully. Your mentor will review it soon.`,
      'success'
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application_id: result.insertId,
      match_score
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Failed to apply', message: error.message });
  }
};

// Get student's applications
exports.getMyApplications = async (req, res) => {
  try {
    const student_id = req.user.id;

    const [applications] = await db.query(`
      SELECT 
        a.*,
        i.title as role,
        i.company_name,
        i.duration,
        i.stipend,
        i.location
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      JOIN student_profiles sp ON a.student_id = sp.id
      WHERE sp.user_id = ?
      ORDER BY a.applied_at DESC
    `, [student_id]);

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

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { roll_number, branch, semester, cgpa, date_of_birth, linkedin_url, github_url, skills } = req.body;

    // Check if profile exists
    const [existing] = await db.query(
      'SELECT * FROM student_profiles WHERE user_id = ?',
      [student_id]
    );

    let student_profile_id;

    if (existing.length === 0) {
      // Create new profile
      const [result] = await db.query(
        'INSERT INTO student_profiles (user_id, roll_number, branch, semester, cgpa, date_of_birth, linkedin_url, github_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [student_id, roll_number, branch, semester, cgpa, date_of_birth, linkedin_url, github_url]
      );
      student_profile_id = result.insertId;
      
      // Send welcome notification
      await sendNotification(
        student_id,
        'Profile Created',
        'Welcome to Campus Connect! Your profile has been created successfully.',
        'success'
      );
    } else {
      // Update existing profile
      student_profile_id = existing[0].id;
      await db.query(
        'UPDATE student_profiles SET roll_number = ?, branch = ?, semester = ?, cgpa = ?, date_of_birth = ?, linkedin_url = ?, github_url = ? WHERE user_id = ?',
        [roll_number, branch, semester, cgpa, date_of_birth, linkedin_url, github_url, student_id]
      );
    }

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      // Delete old skills
      await db.query('DELETE FROM student_skills WHERE student_id = ?', [student_profile_id]);
      
      // Insert new skills
      for (const skill of skills) {
        await db.query(
          'INSERT INTO student_skills (student_id, skill_name, proficiency) VALUES (?, ?, ?)',
          [student_profile_id, skill.name, skill.proficiency || 'intermediate']
        );
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
};

// Get student profile with skills
// Get student profile with skills
exports.getMyProfile = async (req, res) => {
  try {
    const student_id = req.user.id;

    const [profiles] = await db.query(
      'SELECT * FROM student_profiles WHERE user_id = ?',
      [student_id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Profile not found. Please create your profile first.' 
      });
    }

    const profile = profiles[0];

    // Get skills - map skill_name to name for consistency
    const [skills] = await db.query(
      'SELECT skill_name as name, proficiency FROM student_skills WHERE student_id = ?',
      [profile.id]
    );

    res.json({
      success: true,
      profile: {
        ...profile,
        skills
      }
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch profile', 
      message: error.message 
    });
  }
};

// Simple match score calculation (we'll enhance this with AI later)
async function calculateMatchScore(student_profile_id, internship_id) {
  try {
    // Get student skills
    const [studentSkills] = await db.query(
      'SELECT skill_name FROM student_skills WHERE student_id = ?',
      [student_profile_id]
    );

    // Get required internship skills
    const [internshipSkills] = await db.query(
      'SELECT skill_name FROM internship_skills WHERE internship_id = ?',
      [internship_id]
    );

    if (internshipSkills.length === 0) return 50; // Default score if no skills specified

    const studentSkillNames = studentSkills.map(s => s.skill_name.toLowerCase());
    const requiredSkillNames = internshipSkills.map(s => s.skill_name.toLowerCase());

    // Calculate percentage match
    const matchedSkills = requiredSkillNames.filter(skill => 
      studentSkillNames.includes(skill)
    );

    const matchPercentage = Math.round((matchedSkills.length / requiredSkillNames.length) * 100);

    return matchPercentage;
  } catch (error) {
    console.error('Match score calculation error:', error);
    return 0;
  }
}

module.exports = exports;