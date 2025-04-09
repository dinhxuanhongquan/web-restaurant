import React, { useState } from "react";
import './Header.css';

const Header = ({ setIsLoginOpen, user, onLogout, isAdmin, toggleAdminPanel }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = () => {
        setIsLoginOpen(true);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="logo">
                        <h1>La Delizioso</h1>
                    </div>
                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#about">About us</a></li>
                            <li><a href="#contact">Contact</a></li>
                            {isAdmin && (
                                <li>
                                    <button 
                                        className="manager-btn" 
                                        onClick={toggleAdminPanel}
                                    >
                                        Manager
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="mobile-menu" onClick={toggleMenu}>
                        <div className={`hambuger ${isMenuOpen ? 'active' : ''}`}></div>
                    </div>
                    {user ? (
                        <div className="user-controls">
                            <div className="user-welcome">Hi, {user.username}</div>
                            <button className="logout-btn" onClick={onLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="login-btn" onClick={handleLogin}>
                            Login
                        </div>
                    )}
                </div>
            </div>
        </header>   
    );
};

export default Header;