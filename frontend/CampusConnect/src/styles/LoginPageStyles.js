// LoginPageStyles.js

export const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 25%, #2d2d5f 50%, #1a1a3e 75%, #0f0f1e 100%)",
    backgroundSize: "200% 200%",
    animation: "gradientShift 8s ease infinite",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },

  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)", // Safari support
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "24px",
    padding: "2rem",
    width: "100%",
    maxWidth: "448px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    color: "#fff",
    margin: "0 1rem",
  },

  title: {
    fontSize: "1.875rem",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: "0.5rem",
    textAlign: "center",
    letterSpacing: "0.025em",
  },

  subtitle: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "2rem",
    fontSize: "0.875rem",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    display: "block",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.875rem",
    marginBottom: "0.5rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },

  inputFocus: {
    outline: "2px solid #a78bfa",
    outlineOffset: "2px",
    borderColor: "#a78bfa",
  },

  passwordContainer: {
    position: "relative",
  },

  passwordInput: {
    width: "100%",
    padding: "0.75rem 3rem 0.75rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },

  togglePasswordButton: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.6)",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.3s ease",
  },

  togglePasswordButtonHover: {
    color: "#ffffff",
  },

  loginButton: {
    width: "100%",
    padding: "0.75rem 0",
    background: "linear-gradient(to right, #9333ea, #4f46e5)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },

  loginButtonHover: {
    background: "linear-gradient(to right, #7e22ce, #4338ca)",
    transform: "scale(1.05)",
    boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
  },

  loginButtonActive: {
    transform: "scale(0.95)",
  },

  forgotPassword: {
    marginTop: "1.5rem",
    textAlign: "center",
  },

  forgotPasswordLink: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.875rem",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },

  forgotPasswordLinkHover: {
    color: "#ffffff",
  },
};

// Add gradient animation keyframes and remove body margin/padding
export const injectKeyframes = () => {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes gradientShift {
      0%, 100% { 
        background-position: 0% 50%; 
      }
      50% { 
        background-position: 100% 50%; 
      }
    }

    /* Remove default body margin and padding */
    body, html {
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      width: 100%;
      height: 100%;
      background: #0f0f1e;
    }

    /* Remove default margin from root */
    #root {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.appendChild(styleSheet);
};

// Call this function when your app loads
if (typeof window !== "undefined") {
  injectKeyframes();
}