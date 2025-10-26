// src/pages/TpoHome.jsx
import { dashboardStyles } from "../styles/DashboardStyles";

export default function RecruiterHome() {
  return (
    <div style={dashboardStyles.container}>
      <h1 style={{ ...dashboardStyles.title, color: "#1565c0" }}>Recruiter Dashboard</h1>
      <p style={dashboardStyles.subtitle}>Welcome to the Recruiter panel.</p>
    </div>
  );
}
