// LoginPage.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { styles } from "../styles/LoginPageStyles";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [activeButton, setActiveButton] = useState(false);
  const [hoveredToggle, setHoveredToggle] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    alert(`Login attempted with:\nEmail: ${email}`);
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
          >
            Login
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default LoginPage;