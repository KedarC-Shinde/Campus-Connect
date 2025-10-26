// src/pages/StudentHome.jsx
import TopBar from "../components/TopBar";
import { dashboardStyles } from "../styles/DashboardStyles";

export default function StudentHome() {
  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <TopBar />
      <div style={dashboardStyles.container}>
        <h1 style={{ ...dashboardStyles.title, color: "#1565c0" }}>
          Student Dashboard
        </h1>
        <p style={dashboardStyles.subtitle}>
          Explore internships and manage your profile.
        </p>
      </div>
    </div>
  );
}
