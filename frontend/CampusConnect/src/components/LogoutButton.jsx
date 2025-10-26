// src/components/LogoutButton.jsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to login
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  };

  const hoverStyle = {
    backgroundColor: "#b71c1c",
  };

  return (
    <button
      style={buttonStyle}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)
      }
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
