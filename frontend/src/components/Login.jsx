import React, { useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ onLoginSuccess = null }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const API_BASE = "http://localhost:4000";

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setSubmitError("");
    const validation = validate();
    setErrors(validation);

    // ✅ FIXED validation check
    if (Object.keys(validation).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await resp.json();
      } catch {
        // ignore malformed JSON
      }

      if (!resp.ok) {
        setSubmitError(data?.message || "Login failed");
        return;
      }

      // ✅ save auth
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(data.user || { email: payload.email })
        );
      }

      const user = data.user || { email: payload.email };

      // ✅ FIXED event dispatch
      window.dispatchEvent(
        new CustomEvent("authChanged", { detail: { user } })
      );

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(user);
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setSubmitError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";

    if (!password) e.password = "Password is required";

    return e;
  };

  // ---------------- RENDER ----------------
  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>

      <Link to="/" className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Home</span>
      </Link>

      <div className={loginStyles.formContainer}>
        {/* ✅ FIXED: onSubmit added */}
        <form
          className={loginStyles.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className={loginStyles.formWrapper}>
            <div className={loginStyles.animatedBorder}>
              <div className={loginStyles.formContent}>
                <h2 className={loginStyles.heading}>
                  <span className={loginStyles.headingIcon}>
                    <LogIn />
                  </span>
                  <span className={loginStyles.headingText}>Login</span>
                </h2>

                <p className={loginStyles.subtitle}>
                  Sign in to continue to TwoDimension Quiz.
                </p>

                {/* EMAIL */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Email</span>
                  <div className={loginStyles.inputContainer}>
                    <Mail className={loginStyles.inputIconInner} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((s) => ({ ...s, email: undefined }));
                      }}
                      className={`${loginStyles.input} ${
                        errors.email
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                      placeholder="your@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className={loginStyles.errorText}>{errors.email}</p>
                  )}
                </label>

                {/* PASSWORD */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Password</span>
                  <div className={loginStyles.inputContainer}>
                    <Lock className={loginStyles.inputIconInner} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors((s) => ({ ...s, password: undefined }));
                      }}
                      className={`${loginStyles.input} ${
                        errors.password
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className={loginStyles.passwordToggle}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className={loginStyles.errorText}>
                      {errors.password}
                    </p>
                  )}
                </label>

                {submitError && (
                  <p className={loginStyles.submitError}>{submitError}</p>
                )}

                <button
                  type="submit"
                  className={loginStyles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className={loginStyles.signupContainer}>
                  <span>Don't have an account?</span>
                  <Link to="/signup" className={loginStyles.signupLink}>
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{loginStyles.animations}</style>
    </div>
  );
};

export default Login;
