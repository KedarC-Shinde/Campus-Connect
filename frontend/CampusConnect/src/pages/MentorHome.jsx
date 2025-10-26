import React from "react";

export default function MentorHome() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome Mentor Dashboard</h1>
      <p style={styles.subtext}>
        Guide students, share insights, and review assigned mentees’ progress.
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
      "linear-gradient(135deg, rgba(173,216,230,0.3), rgba(70,130,180,0.5))",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "#003366",
    marginBottom: "10px",
  },
  subtext: {
    fontSize: "1.1rem",
    color: "#333",
    textAlign: "center",
    maxWidth: "500px",
  },
};
