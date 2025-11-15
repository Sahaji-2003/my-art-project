// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a href="/" className="navbar-brand d-flex align-items-center">
            <div className="me-2 fs-3">🎨</div>
            <span className="fw-bold text-primary fs-4">Arthub</span>
          </a>
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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#artists">Artists</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
            </ul>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-primary mb-4">Discover & Collect Extraordinary Art</h1>
              <p className="lead text-muted mb-4">
                Connect with talented artists worldwide. Buy and sell unique artwork in a 
                secure, artist-friendly marketplace.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/signup')}>
                  <i className="bi bi-upload me-2"></i>
                  Start Selling Your Art
                </button>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
                  <i className="bi bi-search me-2"></i>
                  Explore Artworks
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="fs-1 mb-3">🎨</div>
              <div className="d-flex justify-content-center gap-3 mb-3">
                <div className="fs-2">🖌️</div>
                <div className="fs-2">📸</div>
                <div className="fs-2">✏️</div>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <div className="fs-3">🖼️</div>
                <div className="fs-3">🎭</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" id="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h2 text-primary mb-3">Why Choose Arthub?</h2>
            <p className="lead text-muted">
              Everything you need to showcase, discover, and sell art in one platform
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="fs-1 mb-3">🎨</div>
                  <h5 className="card-title">Showcase Your Art</h5>
                  <p className="card-text text-muted">
                    Create a stunning portfolio with high-quality images. Upload unlimited 
                    artworks and reach art lovers worldwide.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="fs-1 mb-3">🔒</div>
                  <h5 className="card-title">Secure Transactions</h5>
                  <p className="card-text text-muted">
                    Buy and sell with confidence. All transactions are encrypted and 
                    protected with advanced security measures.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="fs-1 mb-3">🔍</div>
                  <h5 className="card-title">Advanced Search</h5>
                  <p className="card-text text-muted">
                    Find exactly what you're looking for. Filter by style, medium, price 
                    range, and more to discover perfect pieces.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="fs-1 mb-3">📊</div>
                  <h5 className="card-title">Sales Analytics</h5>
                  <p className="card-text text-muted">
                    Track your performance with detailed analytics. Monitor sales, views, 
                    and engagement to grow your art business.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="fs-1 mb-3">🤝</div>
                  <h5 className="card-title">Artist Community</h5>
                  <p className="card-text text-muted">
                    Connect with fellow artists and collectors. Share resources, 
                    collaborate, and grow together.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="fs-1 mb-3">💰</div>
                  <h5 className="card-title">Fair Pricing</h5>
                  <p className="card-text text-muted">
                    Keep more of what you earn. No middlemen, transparent fees, and 
                    direct artist-to-buyer transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="h2 mb-3">Ready to Join Our Creative Community?</h2>
            <p className="lead mb-4">
              Whether you're an artist looking to sell or an art enthusiast ready to discover, 
              Arthub is your gateway to the world of extraordinary art.
            </p>
            <button className="btn btn-light btn-lg" onClick={() => navigate('/signup')}>
              <i className="bi bi-person-plus me-2"></i>
              Create Your Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

