import React from 'react';

import { Link } from 'react-router-dom';


 

const Footer: React.FC = () => {

 return (

   <footer className="footer">

     <div className="footer-container">

       <div className="footer-main">

         <div className="footer-brand">

           <div className="footer-logo">

             <div className="logo-icon">🎨</div>

             <span className="logo-text">Arthub</span>

           </div>

           <p className="footer-tagline">

             Connecting artists and buyers with a seamless marketplace experience.

           </p>

           <div className="social-links">

             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">

               <span>📘</span>

             </a>

             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">

               <span>🐦</span>

             </a>

             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">

               <span>📷</span>

             </a>

             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">

               <span>💼</span>

             </a>

           </div>

         </div>


 

         <div className="footer-links">

           <div className="footer-column">

             <h4>Product</h4>

             <Link to="/dashboard">Dashboard</Link>

             <Link to="/search">Explore</Link>

             <Link to="/upload">Upload</Link>

             <Link to="/inventory">Inventory</Link>

             <Link to="/community">Community</Link>

           </div>


 

           <div className="footer-column">

             <h4>Company</h4>

             <Link to="/about">About Us</Link>

             <Link to="/careers">Careers</Link>

             <Link to="/blog">Blog</Link>

           </div>


 

           <div className="footer-column">

             <h4>Resources</h4>

             <Link to="/help">Help Center</Link>

             <Link to="/support">Support</Link>

             <Link to="/terms">Terms of Service</Link>

             <Link to="/privacy">Privacy Policy</Link>

           </div>


 

           <div className="footer-column">

             <h4>Connect</h4>

             <Link to="/contact">Contact Us</Link>

             <Link to="/support">Support</Link>

           </div>

         </div>


 

         <div className="footer-contact">

           <h4>Have questions or want to partner with us?</h4>

           <Link to="/contact" className="contact-link">Contact Sales</Link>

         </div>

       </div>


 

       <div className="footer-bottom">

         <p>© 2025 Arthub. All rights reserved.</p>

       </div>

     </div>

   </footer>

 );

};


 

export default Footer;