import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStore } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        {/* Customer Care */}
        <div className="footer-section">
          <h4>Customer Care</h4>
          <ul>
            <li><a href="/Contact">Help Center</a></li>
            <li><a href="/returns">Returns & Refunds</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/FAQs">FAQs</a></li>
            <li><a href="/Contact">Contact Us</a></li>
          </ul>
        </div>

        {/* About */}
        <div className="footer-section">
          <h4>About MANWELL</h4>
          <ul>
            <li><a href="/About-us">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/Terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter">
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>

        {/* Business Details */}
        <div className="footer-section business-details">
          <h4>Business Details</h4>
          <ul>
            <li><FaStore /> Fashion Store</li>
            <li><FaMapMarkerAlt /> 6th Street Tower (Eastleigh), Nairobi</li>
            <li><FaPhoneAlt /> +254 794 701 113</li>
            <li><FaEnvelope /> manwellstore@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MANWELL STORE. All rights reserved.</p>
        <p className="footer-credit">
          Designed & Developed by{" "}
          <a
            href="https://manderasoft.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mandera Soft
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
