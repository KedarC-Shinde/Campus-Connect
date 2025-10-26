// src/components/TopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div
      style={{
        backgroundColor: "#1565c0",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
      }}
    >
      <h2 style={{ margin: 0 }}>Campus Connect</h2>
      <div style={{ position: "relative" }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px",
          }}
          onClick={() => {
            const dropdown = document.getElementById("dropdown");
            dropdown.style.display =
              dropdown.style.display === "block" ? "none" : "block";
          }}
        >
          👤
        </button>
        <div
          id="dropdown"
          style={{
            display: "none",
            position: "absolute",
            right: 0,
            backgroundColor: "white",
            color: "black",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            borderRadius: "6px",
            marginTop: "8px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => navigate("/student/profile")}
            style={menuBtnStyle}
          >
            Profile
          </button>
          <button onClick={handleLogout} style={menuBtnStyle}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const menuBtnStyle = {
  padding: "10px 16px",
  display: "block",
  width: "100%",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
};
