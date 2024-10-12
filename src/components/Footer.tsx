import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for the application
 * Displays company information, quick links, and contact details
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div>
        <h3 className="footer-title">Higher Learning Technologies</h3>
        <p>Empowering professionals through innovative educational technology.</p>
      </div>
      <div>
        <h4 className="footer-title">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link to="/" className="link link-hover">Home</Link></li>
          <li><Link to="/author" className="link link-hover">Create Module</Link></li>
          <li><Link to="/about" className="link link-hover">About Us</Link></li>
          <li><Link to="/contact" className="link link-hover">Contact Us</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="footer-title">Get in Touch</h4>
        <address className="not-italic">
          <p>Email: <a href="mailto:support@hlt.com" className="link link-hover">support@hlt.com</a></p>
          <p>Phone: <a href="tel:+11234567890" className="link link-hover">(123) 456-7890</a></p>
          <p>Address: 123 Main St, Anytown, USA</p>
        </address>
      </div>
      <div className="footer-center pt-6 mt-6 border-t border-base-300">
        <p>&copy; {currentYear} Higher Learning Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
