import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Assets/Navbar.css";
import "font-awesome/css/font-awesome.min.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState(
    isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null
  );

  useEffect(() => {
    const syncUser = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const storedUser = loggedIn
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      setIsLoggedIn(loggedIn);
      setUser(storedUser);
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div>
      <header className="header">
        <h1>Krish Health</h1>
      </header>

      <nav className="navbar">
        <div className="navbar-container">
          <ul className="navbar-links">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/departments">Departments</Link>
            </li>
            <li>
              <Link to="/facilities">Facilities</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          {isLoggedIn && user ? (
            <div className="profile-section">
              <button onClick={handleProfileClick} className="profile-icon-btn">
                <i className="fa fa-user-circle" /> {user.email.split("@")[0]}
              </button>
            </div>
          ) : (
            <div className="profile-section">
              <Link to="/login" className="dropdown-btn">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
