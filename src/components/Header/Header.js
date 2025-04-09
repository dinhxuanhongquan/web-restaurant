import React, { useState } from "react";
import './Header.css';

const Header = ({ setIsLoginOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = () => {
        // Open the login modal
        setIsLoginOpen(true);
    }

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="logo">
                        <h1>Restaurant</h1>
                    </div>
                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#about">About us</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="mobile-menu" onClick={toggleMenu}>
                        <div className={`hambuger ${isMenuOpen ? 'active' : ''}`}></div>
                    </div>
                    <div className="login-btn" onClick={handleLogin}>
                        Login
                    </div>
                </div>
            </div>
        </header>   
    );
};

export default Header;