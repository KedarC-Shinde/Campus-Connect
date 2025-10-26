import { dashboardStyles } from "../styles/DashboardStyles";

export default function StudentHome() {
  return (
    <div style={dashboardStyles.container}>
      <h1 style={{ ...dashboardStyles.title, color: "#1565c0" }}>Student Dashboard</h1>
      <p style={dashboardStyles.subtitle}>This is your Student Dashboard.</p>
    </div>
  );
}
