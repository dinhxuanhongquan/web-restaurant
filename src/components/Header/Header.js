import React, { useState, useEffect } from "react";
import './Header.css';
import axios from "axios";

const Header = ({ 
    setIsLoginOpen, 
    user, 
    onLogout: logoutHandler, 
    setIsAdminPanelOpen,
    setIsProfileOpen,
    setIsMenuPageOpen
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`http://localhost:8000/restaurant/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.result || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


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

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    <div className="logo">
                        <h1>Nhà Hàng Truyền Thống</h1>
                    </div>
                    <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            <li><a href="#home">Trang chủ</a></li>
                            <li><a href="#menu">Thực đơn</a></li>
                            <li><a href="#about">Về chúng tôi</a></li>
                            <li><a href="#contact">Liên hệ</a></li>
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
                            <li style={{ cursor: 'pointer' }} onClick={() => setIsMenuPageOpen(true)}>Danh sách món ăn</li>
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
                                <div className="user-dropdown">
                                    <div className="user-dropdown-content">
                                        <div className="user-avatar-container">
                                            {users.image ? (
                                                <img 
                                                    src={typeof users.image === 'object' && users.image.data ? users.image.data : users.image}
                                                    alt="User Avatar" 
                                                    className="user-avatar"
                                                />
                                            ) : (
                                                <div className="default-avatar">
                                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <span className="user-full-name">{users.firstName} {users.lastName}</span>
                                        </div>
                                        <button className="logout-btn" onClick={() => setIsProfileOpen(true)}>Tài khoản của tôi</button>
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