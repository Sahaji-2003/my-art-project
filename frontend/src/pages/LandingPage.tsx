import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <a href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4">
            <i className="bi bi-palette-fill text-primary fs-3"></i>
            <span>Arthub</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link" href="#artists">Artists</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
            </ul>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary rounded-pill" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="btn btn-primary rounded-pill shadow-sm" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-3 py-md-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0 text-white">
              <h1 className="display-5 fw-bold mb-3">Discover & Collect Extraordinary Art</h1>
              <p className="lead mb-3" style={{ opacity: 0.9 }}>
                Connect with talented artists worldwide. Buy and sell unique artwork in a 
                secure, artist-friendly marketplace.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <button className="btn btn-light btn-lg rounded-pill shadow-sm fw-semibold px-4" onClick={() => navigate('/signup')}>
                  <i className="bi bi-cloud-upload-fill me-2"></i>
                  Start Selling Your Art
                </button>
                <button className="btn btn-outline-light btn-lg rounded-pill fw-semibold px-4" onClick={() => navigate('/signup')}>
                  <i className="bi bi-search me-2"></i>
                  Explore Artworks
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="/assets/images/wallpaper/wallpaper.jpg" 
                alt="Art Gallery" 
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" id="features">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Why Choose Arthub?</h2>
            <p className="lead text-muted">
              Everything you need to showcase, discover, and sell art in one platform
            </p>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="mb-3">
                  <i className="bi bi-palette-fill text-primary fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Showcase Your Art</h3>
                <p className="text-muted mb-0">
                  Create a stunning portfolio with high-quality images. Upload unlimited 
                  artworks and reach art lovers worldwide.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="mb-3">
                  <i className="bi bi-shield-check-fill text-success fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Secure Transactions</h3>
                <p className="text-muted mb-0">
                  Buy and sell with confidence. All transactions are encrypted and 
                  protected with advanced security measures.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="mb-3">
                  <i className="bi bi-search text-info fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Advanced Search</h3>
                <p className="text-muted mb-0">
                  Find exactly what you're looking for. Filter by style, medium, price 
                  range, and more to discover perfect pieces.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="mb-3">
                  <i className="bi bi-graph-up-arrow text-warning fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Sales Analytics</h3>
                <p className="text-muted mb-0">
                  Track your performance with detailed analytics. Monitor sales, views, 
                  and engagement to grow your art business.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="mb-3">
                  <i className="bi bi-people-fill text-primary fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Artist Community</h3>
                <p className="text-muted mb-0">
                  Connect with fellow artists and collectors. Share resources, 
                  collaborate, and grow together.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 text-center">
                <div className="mb-3">
                  <i className="bi bi-cash-stack text-success fs-1"></i>
                </div>
                <h3 className="fw-bold mb-3">Fair Pricing</h3>
                <p className="text-muted mb-0">
                  Keep more of what you earn. No middlemen, transparent fees, and 
                  direct artist-to-buyer transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <div className="text-center text-white">
            <h2 className="display-5 fw-bold mb-3">Ready to Join Our Creative Community?</h2>
            <p className="lead mb-4" style={{ opacity: 0.9 }}>
              Whether you're an artist looking to sell or an art enthusiast ready to discover, 
              Arthub is your gateway to the world of extraordinary art.
            </p>
            <button className="btn btn-light btn-lg rounded-pill shadow-sm fw-semibold px-5" onClick={() => navigate('/signup')}>
              <i className="bi bi-person-plus-fill me-2"></i>
              Create Your Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
