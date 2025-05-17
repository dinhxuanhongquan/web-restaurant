import React, { useState } from "react";
import './Header.css';

const Header = ({ setIsLoginOpen, user, onLogout, setIsAdminPanelOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="logo">
                        <h1>My Restaurant</h1>
                    </div>
                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#about">About us</a></li>
                            <li><a href="#contact">Contact</a></li>
                            {user?.isAdmin && (
                                <li>
                                    <button 
                                        className="admin-btn" 
                                        onClick={setIsAdminPanelOpen}
                                    >
                                        Quản trị
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="mobile-menu" onClick={toggleMenu}>
                        <div className={`hambuger ${isMenuOpen ? 'active' : ''}`}></div>
                    </div>
                    <div className="user-controls">
                        {!user ? (
                            <div className="login-btn" onClick={() => setIsLoginOpen(true)}>
                                Đăng nhập
                            </div>
                        ) : (
                            <div className="user-welcome">Hi, {user.username}
                                <button className="logout-btn" onClick={onLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>   
    );
};

export default Header;