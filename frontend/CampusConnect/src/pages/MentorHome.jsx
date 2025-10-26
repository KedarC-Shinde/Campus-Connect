// src/pages/TpoHome.jsx
import { dashboardStyles } from "../styles/DashboardStyles";

export default function MentorHome() {
  return (
    <div style={dashboardStyles.container}>
      <h1 style={{ ...dashboardStyles.title, color: "#1565c0" }}>Mentor Dashboard</h1>
      <p style={dashboardStyles.subtitle}>Welcome to the Mentor panel.</p>
    </div>
  );
}
