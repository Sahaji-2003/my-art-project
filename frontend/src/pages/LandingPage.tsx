// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            <div className="logo-icon">🎨</div>
            <span>Arthub</span>
          </a>
          <ul className="navbar-menu">
            <li><a href="#features">Features</a></li>
            <li><a href="#artists">Artists</a></li>
            <li><a href="#about">About</a></li>
          </ul>
          <div className="navbar-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Log In
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content fade-in">
          <h1 className="hero-title">Discover & Collect Extraordinary Art</h1>
          <p className="hero-subtitle">
            Connect with talented artists worldwide. Buy and sell unique artwork in a 
            secure, artist-friendly marketplace.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/signup')}>
              Start Selling Your Art
            </button>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/signup')}>
              Explore Artworks
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose Arthub?</h2>
          <p className="section-subtitle">
            Everything you need to showcase, discover, and sell art in one platform
          </p>
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">🎨</div>
              <h3>Showcase Your Art</h3>
              <p>
                Create a stunning portfolio with high-quality images. Upload unlimited 
                artworks and reach art lovers worldwide.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>
                Buy and sell with confidence. All transactions are encrypted and 
                protected with advanced security measures.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>
                Find exactly what you're looking for. Filter by style, medium, price 
                range, and more to discover perfect pieces.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">📊</div>
              <h3>Sales Analytics</h3>
              <p>
                Track your performance with detailed analytics. Monitor sales, views, 
                and engagement to grow your art business.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🤝</div>
              <h3>Artist Community</h3>
              <p>
                Connect with fellow artists and collectors. Share resources, 
                collaborate, and grow together.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">💰</div>
              <h3>Fair Pricing</h3>
              <p>
                Keep more of what you earn. No middlemen, transparent fees, and 
                direct artist-to-buyer transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Join Our Creative Community?</h2>
          <p>
            Whether you're an artist looking to sell or an art enthusiast ready to discover, 
            Arthub is your gateway to the world of extraordinary art.
          </p>
          <button className="btn btn-secondary btn-large" onClick={() => navigate('/signup')}>
            Create Your Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

