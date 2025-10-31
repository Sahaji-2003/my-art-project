import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeAuthToken } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  return (
    <header className="navbar navbar-expand-lg bg-primary border-bottom" style={{ backgroundColor: '#4A90E2' }}>
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Logo and App Name */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" style={{ color: 'white' }}>
          <i className="bi bi-palette-fill fs-3" style={{ color: 'white' }}></i>
          <span className="logo-text fw-bold" style={{ color: 'white' }}>Arthub</span>
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

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <nav className="navbar-nav me-auto mb-2 mb-lg-0">
            <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
            <Link to="/search" className="nav-link text-white">Search</Link>
            <Link to="/community" className="nav-link text-white">Community</Link>
            <Link to="/inventory" className="nav-link text-white">Inventory</Link>
            <Link to="/upload" className="nav-link text-white">Upload</Link>
          </nav>

          {/* Search Bar */}
          <div className="input-group me-3" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              placeholder="Search artworks or artists..." 
              className="form-control border-start-0"
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
            <div className="d-flex align-items-center gap-2 gap-md-3 flex-nowrap">
              <Link to="/profile" className="btn btn-primary d-flex align-items-center gap-2" style={{ backgroundColor: '#4A90E2', borderColor: '#4A90E2' }}>
                <i className="bi bi-person-circle"></i>
                <span className="d-none d-md-inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-danger d-flex align-items-center gap-2" type="button" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-md-inline">Logout</span>
              </button>
              <div className="user-avatar d-flex align-items-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <img 
                  src="https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=U" 
                  alt="User Avatar" 
                  className="rounded-circle"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-primary" style={{ backgroundColor: '#4A90E2', borderColor: '#4A90E2' }}>Log In</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;