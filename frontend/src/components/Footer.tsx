import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-12 col-lg-3 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-palette-fill text-primary fs-3"></i>
              <span className="fw-bold fs-4">Arthub</span>
            </div>
            <p className="text-muted mb-3">
              Connecting artists and buyers with a seamless marketplace experience.
            </p>
            <div className="d-flex gap-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-12 col-lg-6">
            <div className="row g-3">
              <div className="col-6 col-sm-3">
                <h4 className="fw-bold mb-3">Product</h4>
                <Link to="/dashboard" className="d-block mb-2 text-muted text-decoration-none">Dashboard</Link>
                <Link to="/search" className="d-block mb-2 text-muted text-decoration-none">Search</Link>
                <Link to="/upload" className="d-block mb-2 text-muted text-decoration-none">Upload</Link>
                <Link to="/inventory" className="d-block mb-2 text-muted text-decoration-none">Inventory</Link>
                <Link to="/community" className="d-block mb-2 text-muted text-decoration-none">Community</Link>
              </div>

              <div className="col-6 col-sm-3">
                <h4 className="fw-bold mb-3">Company</h4>
                <Link to="/about" className="d-block mb-2 text-muted text-decoration-none">About Us</Link>
                <Link to="/careers" className="d-block mb-2 text-muted text-decoration-none">Careers</Link>
                <Link to="/blog" className="d-block mb-2 text-muted text-decoration-none">Blog</Link>
              </div>

              <div className="col-6 col-sm-3">
                <h4 className="fw-bold mb-3">Resources</h4>
                <Link to="/help" className="d-block mb-2 text-muted text-decoration-none">Help Center</Link>
                <Link to="/pricing" className="d-block mb-2 text-muted text-decoration-none">Pricing</Link>
                <Link to="/terms" className="d-block mb-2 text-muted text-decoration-none">Terms of Service</Link>
                <Link to="/privacy" className="d-block mb-2 text-muted text-decoration-none">Privacy Policy</Link>
              </div>

              <div className="col-6 col-sm-3">
                <h4 className="fw-bold mb-3">Connect</h4>
                <Link to="/contact" className="d-block mb-2 text-muted text-decoration-none">Contact Us</Link>
                <Link to="/support" className="d-block mb-2 text-muted text-decoration-none">Support</Link>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-12 col-lg-3 text-center text-lg-start">
            <h4 className="fw-bold mb-3">Have questions or want to partner with us?</h4>
            <Link to="/contact" className="btn btn-outline-primary rounded-pill text-decoration-none">
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-top mt-4 pt-4 text-center">
          <p className="mb-0 text-muted">© 2025 Arthub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;