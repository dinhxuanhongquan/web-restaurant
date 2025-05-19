import React, { useState } from "react";
import './Header.css';
import axios from "axios";

const Header = ({ 
    setIsLoginOpen, 
    user, 
    onLogout: logoutHandler, 
    setIsAdminPanelOpen,
    setIsProfileOpen 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            await axios.post(
                `http://localhost:8000/restaurant/auth/logout`, 
                {}, // empty request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Logout successful");
            localStorage.removeItem('token');
            logoutHandler(); // Call the prop function from parent
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
                            <div className="user-welcome">
                                Hi, {user.username}
                                <div className="user-dropdown">
                                    <button className="user-menu-btn">
                                        <i className="fa fa-user"></i> {/* Thêm FontAwesome nếu có */}
                                    </button>
                                    <div className="user-dropdown-content">
                                        <button onClick={() => setIsProfileOpen(true)}>Tài khoản của tôi</button>
                                        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>   
    );
};

export default Header;