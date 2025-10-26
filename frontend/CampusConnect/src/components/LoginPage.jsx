import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { styles } from "../styles/LoginPageStyles";
import { authService } from "../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.loginUser(email, password);
      const { token, user } = res;

      // ✅ Save to Redux
      dispatch(loginSuccess({ token, user }));

      // ✅ Navigate based on role
      switch (user.role) {
        case "student":
          navigate("/student/home");
          break;
        case "mentor":
          navigate("/mentor/home");
          break;
        case "tpo":
          navigate("/tpo/home");
          break;
        case "recruiter":
          navigate("/recruiter/home");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Placement Portal</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your college email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={styles.passwordInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={styles.togglePasswordButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" style={styles.loginButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
