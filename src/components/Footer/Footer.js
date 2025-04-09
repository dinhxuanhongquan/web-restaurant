import React from 'react';
import './Footer.css';
import { faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>La Delizioso</h2>
            <p>Authentic Italian Cuisine</p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>17A Cộng Hòa, Tân Bình, TP.Hồ Chí Minh</p>
            <p>Hồ Chí Minh, Việt Nam 2025</p>
            <p>Phone: (+84) 0963 689 773</p>
            <p>Email: quandinh.09022003@gmail.com</p>
          </div>
          
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com/hong.quann.660872/" className="social-icon">
              <FontAwesomeIcon icon={faFacebook} size='2x' spin/>Facebook
              </a>
              <a href="https://github.com/dinhxuanhongquan" className="social-icon">
              <FontAwesomeIcon icon={faGithub} size='2x' spin/> GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} La Delizioso. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;