import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


 

const Footer: React.FC = () => {

  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="me-2 fs-3">🎨</div>
              <span className="fs-4 fw-bold text-primary">Arthub</span>
            </div>
            <p className="text-muted mb-3">
              Connecting artists and buyers with a seamless marketplace experience.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
            <h5 className="text-primary mb-3">Product</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/dashboard" className="text-light text-decoration-none">Dashboard</Link></li>
              <li className="mb-2"><Link to="/search" className="text-light text-decoration-none">Explore</Link></li>
              <li className="mb-2"><Link to="/upload" className="text-light text-decoration-none">Upload</Link></li>
              <li className="mb-2"><Link to="/inventory" className="text-light text-decoration-none">Inventory</Link></li>
              <li className="mb-2"><Link to="/community" className="text-light text-decoration-none">Community</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
            <h5 className="text-primary mb-3">Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/careers" className="text-light text-decoration-none">Careers</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-light text-decoration-none">Blog</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
            <h5 className="text-primary mb-3">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/help" className="text-light text-decoration-none">Help Center</Link></li>
              <li className="mb-2"><Link to="/support" className="text-light text-decoration-none">Support</Link></li>
              <li className="mb-2"><Link to="/terms" className="text-light text-decoration-none">Terms of Service</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-light text-decoration-none">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect Links */}
          <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
            <h5 className="text-primary mb-3">Connect</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/contact" className="text-light text-decoration-none">Contact Us</Link></li>
              <li className="mb-2"><Link to="/support" className="text-light text-decoration-none">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="bg-primary rounded p-4 text-center">
              <h5 className="text-white mb-2">Have questions or want to partner with us?</h5>
              <Link to="/contact" className="btn btn-light btn-sm">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="row mt-4 pt-3 border-top border-secondary">
          <div className="col-12 text-center">
            <p className="text-muted mb-0">© 2025 Arthub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );

};


 

export default Footer;