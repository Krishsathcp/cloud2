import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../Assets/SignUp.css";
import axios from "axios";
import { API_BASE_URL } from "../config"; // ✅ Added import

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // ---- Validation ----
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ---- Send data to backend ----
    try {
      const res = await axios.post(`${API_BASE_URL}/api/signup`, {
        email,
        password,
      });

      if (res.status === 200) {
        alert("✅ Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.response?.data?.error || "Signup failed. Try again later.");
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-header">
        <h1>Krish Health</h1>
      </div>

      <div className="form-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Sign Up</button>

          <div className="link">
            <NavLink to="/login">Already have an account? Login</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
