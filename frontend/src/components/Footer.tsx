import React from 'react';

import { Link } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';


 

const Footer: React.FC = () => {

 return (

   <footer className="footer">

     <div className="footer-container container-fluid px-3 px-md-4 px-lg-5">

       <div className="footer-main row g-4">

         <div className="footer-brand col-12 col-lg-4 mb-4 mb-lg-0">

           <div className="footer-logo mb-3">

             <div className="logo-icon"><i className="bi bi-palette-fill"></i></div>

             <span className="logo-text">Arthub</span>

           </div>

           <p className="footer-tagline mb-3">

             Connecting artists and buyers with a seamless marketplace experience.

           </p>

           <div className="social-links d-flex gap-2">

             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">

               <i className="bi bi-facebook"></i>

             </a>

             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">

               <i className="bi bi-twitter"></i>

             </a>

             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">

               <i className="bi bi-instagram"></i>

             </a>

             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">

               <i className="bi bi-linkedin"></i>

             </a>

           </div>

         </div>

         <div className="footer-links col-12 col-lg-6">

           <div className="row g-3">

             <div className="footer-column col-6 col-sm-3">

               <h4>Product</h4>

               <Link to="/dashboard" className="d-block mb-2 text-decoration-none">Dashboard</Link>

               <Link to="/search" className="d-block mb-2 text-decoration-none">Explore</Link>

               <Link to="/upload" className="d-block mb-2 text-decoration-none">Upload</Link>

               <Link to="/inventory" className="d-block mb-2 text-decoration-none">Inventory</Link>

               <Link to="/community" className="d-block mb-2 text-decoration-none">Community</Link>

             </div>

             <div className="footer-column col-6 col-sm-3">

               <h4>Company</h4>

               <Link to="/about" className="d-block mb-2 text-decoration-none">About Us</Link>

               <Link to="/careers" className="d-block mb-2 text-decoration-none">Careers</Link>

               <Link to="/blog" className="d-block mb-2 text-decoration-none">Blog</Link>

             </div>

             <div className="footer-column col-6 col-sm-3">

               <h4>Resources</h4>

               <Link to="/help" className="d-block mb-2 text-decoration-none">Help Center</Link>

               <Link to="/support" className="d-block mb-2 text-decoration-none">Support</Link>

               <Link to="/terms" className="d-block mb-2 text-decoration-none">Terms of Service</Link>

               <Link to="/privacy" className="d-block mb-2 text-decoration-none">Privacy Policy</Link>

             </div>

             <div className="footer-column col-6 col-sm-3">

               <h4>Connect</h4>

               <Link to="/contact" className="d-block mb-2 text-decoration-none">Contact Us</Link>

               <Link to="/support" className="d-block mb-2 text-decoration-none">Support</Link>

             </div>

           </div>

         </div>

         <div className="footer-contact col-12 col-lg-2 text-center text-lg-start">

           <h4 className="mb-3">Have questions or want to partner with us?</h4>

           <Link to="/contact" className="contact-link btn btn-outline-primary w-100 w-lg-auto text-decoration-none">Contact Sales</Link>

         </div>

       </div>

       <div className="footer-bottom">

         <p className="mb-0">© 2025 Arthub. All rights reserved.</p>

       </div>

     </div>

   </footer>

 );

};


 

export default Footer;