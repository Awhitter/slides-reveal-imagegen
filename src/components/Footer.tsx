import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-2xl font-bold mb-2">Higher Learning Technologies</h3>
            <p className="text-indigo-200">
              Empowering professionals through innovative educational technology.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6">
            <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/author" className="hover:text-indigo-400 transition duration-300">
                  Create Module
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-xl font-semibold mb-2">Get in Touch</h4>
            <p className="text-indigo-200">Email: support@hlt.com</p>
            <p className="text-indigo-200">Phone: (123) 456-7890</p>
            <p className="text-indigo-200">Address: 123 Main St, Anytown, USA</p>
          </div>
        </div>
        <div className="border-t border-indigo-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Higher Learning Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
