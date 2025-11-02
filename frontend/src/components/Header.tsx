import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, removeAuthToken, artistAPI, getUser } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  const currentUser = getUser();
  const [profilePicture, setProfilePicture] = useState<string>('');

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (isLoggedIn && currentUser?.isArtist) {
        try {
          const response = await artistAPI.getProfile();
          if (response.success && response.data?.profilePicture) {
            setProfilePicture(`${response.data.profilePicture}`);
          }
        } catch (error) {
          // Profile doesn't exist or not an artist yet
        }
      } else if (currentUser?.profilePicture) {
        setProfilePicture(currentUser.profilePicture);
      }
    };

    fetchProfilePicture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const getAvatarSrc = () => {
    if (profilePicture) {
      return profilePicture;
    }
    return '/frontend/public/userProfile/bot-1761939632102-692067132.jpg';
  };

  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'text-primary fw-semibold' : 'text-muted';
  };

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Logo and App Name */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div className="bg-primary rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-palette-fill text-white fs-5"></i>
          </div>
          <span className="text-primary fw-bold fs-4">Arthub</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          style={{ borderColor: '#dee2e6' }}
        >
          <span className="navbar-toggler-icon" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.85%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")" }}></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <nav className="navbar-nav me-auto mb-2 mb-lg-0">
            <Link to="/dashboard" className={`nav-link px-3 ${getActiveClass('/dashboard')}`}>Dashboard</Link>
            <Link to="/search" className={`nav-link px-3 ${getActiveClass('/search')}`}>Search</Link>
            <Link to="/community" className={`nav-link px-3 ${getActiveClass('/community')}`}>Community</Link>
            <Link to="/inventory" className={`nav-link px-3 ${getActiveClass('/inventory')}`}>Inventory</Link>
          </nav>

          {/* Search Bar */}
          <div className="d-flex me-auto me-lg-3 mb-3 mb-lg-0" style={{ maxWidth: '350px', flex: '1' }}>
            <div className="input-group w-100">
              <span className="input-group-text bg-white border-end-0 text-muted">
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
          </div>

          {/* User Actions */}
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-2 flex-nowrap">
              <Link to="/profile" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
                <i className="bi bi-person-circle"></i>
                <span className="d-none d-md-inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm d-flex align-items-center gap-2" type="button">
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-md-inline">Logout</span>
              </button>
              <div className="user-avatar rounded-circle overflow-hidden border border-secondary" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <img 
                  src={getAvatarSrc()} 
                  alt="User Avatar" 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;