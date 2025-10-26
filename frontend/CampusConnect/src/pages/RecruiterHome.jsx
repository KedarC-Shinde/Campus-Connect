import React from "react";

export default function RecruiterHome() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome Recruiter Dashboard</h1>
      <p style={styles.subtext}>
        Post job openings, view student applications, and track hiring progress.
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, rgba(255,182,193,0.2), rgba(255,105,180,0.4))",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "#b30059",
    marginBottom: "10px",
  },
  subtext: {
    fontSize: "1.1rem",
    color: "#333",
    textAlign: "center",
    maxWidth: "500px",
  },
};
