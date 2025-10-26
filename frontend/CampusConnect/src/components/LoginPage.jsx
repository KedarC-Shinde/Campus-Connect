import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { styles } from "../styles/LoginPageStyles";
import { authService } from "../services/authService"; // ✅ Import service

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [activeButton, setActiveButton] = useState(false);
  const [hoveredToggle, setHoveredToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.loginUser(email, password);
      console.log("✅ Login success:", res);

      // Navigate or show success message here
      alert("Login successful!");
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
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your college email"
              style={{
                ...styles.input,
                ...(focusedInput === "email" ? styles.inputFocus : {}),
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              required
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={{
                  ...styles.passwordInput,
                  ...(focusedInput === "password" ? styles.inputFocus : {}),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                required
              />
              <button
                type="button"
                style={{
                  ...styles.togglePasswordButton,
                  ...(hoveredToggle ? styles.togglePasswordButtonHover : {}),
                }}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={() => setHoveredToggle(true)}
                onMouseLeave={() => setHoveredToggle(false)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p style={{ color: "red", fontSize: 14, marginBottom: 8 }}>
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={{
              ...styles.loginButton,
              ...(hoveredButton ? styles.loginButtonHover : {}),
              ...(activeButton ? styles.loginButtonActive : {}),
            }}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            onMouseDown={() => setActiveButton(true)}
            onMouseUp={() => setActiveButton(false)}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
