// ============================================
// src/components/Header.tsx
// ============================================
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api.service';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    // logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">🎨</div>
          <span className="logo-text">Arthub</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/community" className="nav-link">Community</Link>
        </nav>

        <div className="header-right">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search artworks or artists..." 
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {isLoggedIn ? (
            <div className="auth-buttons">
              <Link to="/profile" className="btn-profile">
                <span className="profile-icon">👤</span>
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          )}

          <div className="profile-avatar">
            <div className="avatar-circle">U</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;