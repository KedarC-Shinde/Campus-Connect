// src/pages/StudentProfile.jsx
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";

export default function StudentProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [profile, setProfile] = useState({
    roll_number: "",
    branch: "",
    semester: "",
    cgpa: "",
    date_of_birth: "",
    linkedin_url: "",
    github_url: "",
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch user info
        const userRes = await fetch("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (userData.success) {
          setUserInfo(userData.user);
        }

        // Fetch student profile
        const res = await fetch("http://localhost:3000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success && data.profile) {
          setProfile({
            roll_number: data.profile.roll_number || "",
            branch: data.profile.branch || "",
            semester: data.profile.semester || "",
            cgpa: data.profile.cgpa || "",
            date_of_birth: data.profile.date_of_birth ? data.profile.date_of_birth.split("T")[0] : "",
            linkedin_url: data.profile.linkedin_url || "",
            github_url: data.profile.github_url || "",
            skills: data.profile.skills || [],
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSkillChange = (index, key, value) => {
    const newSkills = [...profile.skills];
    newSkills[index][key] = value;
    setProfile({ ...profile, skills: newSkills });
  };

  const addSkill = () => {
    setProfile({
      ...profile,
      skills: [...profile.skills, { name: "", proficiency: "beginner" }],
    });
  };

  const removeSkill = (index) => {
    const newSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: newSkills });
  };

  const handleSave = async () => {
    if (!profile.roll_number || !profile.branch) {
      alert("⚠️ Please fill in Roll Number and Branch");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roll_number: profile.roll_number,
          branch: profile.branch,
          semester: profile.semester ? parseInt(profile.semester) : null,
          cgpa: profile.cgpa ? parseFloat(profile.cgpa) : null,
          date_of_birth: profile.date_of_birth || null,
          linkedin_url: profile.linkedin_url || null,
          github_url: profile.github_url || null,
          skills: profile.skills.filter(skill => skill.name.trim() !== "")
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("✅ Profile updated successfully!");
      } else {
        alert("❌ " + (data.error || "Update failed"));
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        <TopBar />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <TopBar />
      <div style={styles.container}>
        <div style={styles.card}>
          {/* User Info Header */}
          {userInfo && (
            <div style={styles.userInfoHeader}>
              <div style={styles.avatarCircle}>
                {userInfo.first_name?.[0]}{userInfo.last_name?.[0]}
              </div>
              <div>
                <h2 style={styles.title}>
                  {userInfo.first_name} {userInfo.last_name}
                </h2>
                <p style={styles.userEmail}>{userInfo.email}</p>
              </div>
            </div>
          )}

          <p style={styles.subtitle}>
            Update your profile information and skills
          </p>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Roll Number *</label>
              <input
                value={profile.roll_number}
                onChange={(e) => handleChange("roll_number", e.target.value)}
                style={styles.input}
                placeholder="Enter your roll number"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Branch *</label>
              <input
                value={profile.branch}
                onChange={(e) => handleChange("branch", e.target.value)}
                style={styles.input}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Semester</label>
                <input
                  type="number"
                  value={profile.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                  style={styles.input}
                  min="1"
                  max="8"
                  placeholder="1-8"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={profile.cgpa}
                  onChange={(e) => handleChange("cgpa", e.target.value)}
                  style={styles.input}
                  min="0"
                  max="10"
                  placeholder="0.00 - 10.00"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Social Links</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
                style={styles.input}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>GitHub URL</label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => handleChange("github_url", e.target.value)}
                style={styles.input}
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.skillsHeader}>
              <h3 style={styles.sectionTitle}>Skills</h3>
              <button onClick={addSkill} style={styles.addButton}>
                + Add Skill
              </button>
            </div>

            {profile.skills.length === 0 ? (
              <p style={styles.emptyText}>
                No skills added yet. Click "Add Skill" to get started.
              </p>
            ) : (
              profile.skills.map((skill, i) => (
                <div key={i} style={styles.skillRow}>
                  <input
                    placeholder="Skill name (e.g., React)"
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange(i, "name", e.target.value)
                    }
                    style={styles.skillInput}
                  />
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      handleSkillChange(i, "proficiency", e.target.value)
                    }
                    style={styles.skillSelect}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button
                    onClick={() => removeSkill(i)}
                    style={styles.removeButton}
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...styles.saveButton,
              ...(saving ? styles.saveButtonDisabled : {}),
            }}
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
  height: "100vh", // use full viewport height
  overflowY: "auto", // enables vertical scrolling
  backgroundColor: "#f5f7fa",
},

  container: {
    padding: "32px 20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  userInfoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "8px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e0e0e0",
  },
  avatarCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#1565c0",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "600",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1565c0",
    margin: "0",
  },
  userEmail: {
    fontSize: "14px",
    color: "#666",
    margin: "4px 0 0 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginTop: "16px",
    marginBottom: "32px",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e0e0e0",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    outline: "none",
  },
  skillsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  addButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#1565c0",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  skillRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    alignItems: "center",
  },
  skillInput: {
    flex: "2",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box",
    outline: "none",
  },
  skillSelect: {
    flex: "1",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
  },
  removeButton: {
    width: "36px",
    height: "36px",
    fontSize: "18px",
    backgroundColor: "#fff",
    color: "#d32f2f",
    border: "1px solid #d32f2f",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emptyText: {
    fontSize: "14px",
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    padding: "20px",
  },
  saveButton: {
    width: "100%",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    backgroundColor: "#1565c0",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "16px",
    transition: "background-color 0.2s",
  },
  saveButtonDisabled: {
    backgroundColor: "#90caf9",
    cursor: "not-allowed",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #1565c0",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    fontSize: "16px",
    color: "#666",
  },
};