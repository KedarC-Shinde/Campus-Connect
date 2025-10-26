import { dashboardStyles } from "../styles/DashboardStyles";
import LogoutButton from "../components/LogoutButton";

export default function TpoHome() {
  return (
    <div style={dashboardStyles.container}>
      <h1 style={{ ...dashboardStyles.title, color: "#1565c0" }}>
        TPO Dashboard
      </h1>
      <p style={dashboardStyles.subtitle}>Welcome to the TPO panel.</p>
      <LogoutButton />
    </div>
  );
}
