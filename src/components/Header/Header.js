import React, { useState } from "react";
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
                            <li><a href="#Menu">Menu</a></li>
                            <li><a href="About us">About us</a></li>
                            <li><a href="Contact">Contact</a></li>

                        </ul>
                    </div>
                    <div className="mobile-menu" onClick={toggleMenu}>
                        <div className={`hambuger ${isMenuOpen ? 'active' : ''}`}></div>
                    </div>
                </div>
            </div>
        </header>   
        
);
};

export default Header;