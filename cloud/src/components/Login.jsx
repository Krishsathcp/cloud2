import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Assets/Login.css";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ Store login data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("✅ Login successful!");
        navigate("/home");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <h1>Krish Health</h1>
      </header>

      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-links">
          <p>
            Don't have an account?{" "}
            <Link to="/sign_up" className="link">
              Sign up here
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link to="/forgot_password" className="link">
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
