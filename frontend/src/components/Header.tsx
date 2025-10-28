import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeAuthToken } from '../services/api.service';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and App Name */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <div className="palette-icon">🎨</div>
          </div>
          <span className="logo-text">Arthub</span>
        </Link>

            {/* Navigation Links */}
            <nav className="nav-menu">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/search" className="nav-link">Search</Link>
              <Link to="/community" className="nav-link">Community</Link>
              <Link to="/inventory" className="nav-link">Inventory</Link>
              <Link to="/upload" className="nav-link">Upload</Link>
            </nav>

        {/* Search Bar */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search artworks or artists..." 
            className="search-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const query = (e.target as HTMLInputElement).value;
                if (query.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                }
              }
            }}
          />
        </div>

        {/* User Actions */}
        {isLoggedIn ? (
          <div className="user-actions">
            <Link to="/profile" className="btn-profile">
              <span className="profile-icon">👤</span>
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              <span className="logout-icon">↗</span>
              Logout
            </button>
            <div className="user-avatar">
              <img 
                src="https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=U" 
                alt="User Avatar" 
                className="avatar-image"
              />
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Log In</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;