import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeAuthToken } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        {/* Logo and App Name */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <div className="me-2">🎨</div>
          <span className="fw-bold text-primary">Arthub</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link">Search</Link>
            </li>
            <li className="nav-item">
              <Link to="/community" className="nav-link">Community</Link>
            </li>
            <li className="nav-item">
              <Link to="/inventory" className="nav-link">Inventory</Link>
            </li>
            <li className="nav-item">
              <Link to="/upload" className="nav-link">Upload</Link>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="d-flex me-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search artworks or artists..."
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
          </div>

          {/* User Actions */}
          {isLoggedIn ? (
            <div className="d-flex align-items-center">
              <Link to="/profile" className="btn btn-outline-primary btn-sm me-2">
                <i className="bi bi-person me-1"></i>
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm me-2">
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
              <div className="dropdown">
                <img 
                  src="https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=U" 
                  alt="User Avatar" 
                  className="rounded-circle"
                  style={{width: '40px', height: '40px'}}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;