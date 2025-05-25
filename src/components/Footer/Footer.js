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
            <h2>Nhà Hàng Truyền Thống</h2>
            <p>Ẩm thực Việt Nam chính thống</p>
          </div>
          
          <div className="footer-links">
            <h3>Liên kết nhanh</h3>
            <ul>
              <li><a href="#home">Trang chủ</a></li>
              <li><a href="#menu">Thực đơn</a></li>
              <li><a href="#about">Về chúng tôi</a></li>
              <li><a href="#contact">Liên hệ</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Liên hệ</h3>
            <p>17A Cộng Hòa, Tân Bình, TP.Hồ Chí Minh</p>
            <p>Hồ Chí Minh, Việt Nam 2025</p>
            <p>Điện thoại: (+84) 0963 689 773</p>
            <p>Email: quandinh.09022003@gmail.com</p>
          </div>
          
          <div className="footer-social">
            <h3>Theo dõi chúng tôi</h3>
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
          <p>&copy; {new Date().getFullYear()} Nhà Hàng Truyền Thống. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;