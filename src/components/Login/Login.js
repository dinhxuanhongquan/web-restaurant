import React, { useState } from "react";
import './Login.css';

const Login = ({ setIsLoginOpen, onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isLoginMode) {
            console.log('Login data:', formData);
            
            // Kiểm tra xem có phải admin không
            if (formData.username === 'admin' && formData.password === 'admin') {
                onLogin({ 
                    username: formData.username,
                    isAdmin: true
                });
            } else {
                // Xử lý đăng nhập thông thường
                onLogin({
                    username: formData.username,
                    isAdmin: false
                });
            }
        } else {
            // Xử lý đăng ký
            console.log('Register data:', formData);
            
            // Kiểm tra mật khẩu xác nhận
            if (formData.password !== formData.confirmPassword) {
                alert('Password and confirmation do not match!');
                return;
            }
            
            // Đây là nơi bạn sẽ gửi dữ liệu đăng ký đến backend
            alert(`Account created successfully for ${formData.username}!`);
            
            // Chuyển về form đăng nhập sau khi đăng ký
            switchMode();
        }
    };

    const handleClose = () => {
        setIsLoginOpen(false);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        // Reset form khi chuyển đổi
        setFormData({
            username: '',
            password: '',
            email: '',
            confirmPassword: ''
        });
    };

    const handleForgotPassword = () => {
        console.log("Forgot password functionality will be implemented here");
        // Hiển thị form quên mật khẩu hoặc hướng dẫn
        alert("Please contact support to reset your password.");
    };

    return (
        <div className="login-overlay" onClick={handleClose}>
            <div className="login-container" onClick={handleModalClick}>
                <div className="login-wrapper">
                    <div className="login-header">
                        <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
                        <button className="close-btn" onClick={handleClose}>×</button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        {!isLoginMode && (
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email" 
                                    required={!isLoginMode}
                                />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username" 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password" 
                                required 
                            />
                        </div>
                        
                        {!isLoginMode && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password" 
                                    required={!isLoginMode}
                                />
                            </div>
                        )}
                        
                        <button type="submit" className="login-submit-btn">
                            {isLoginMode ? 'Login' : 'Create Account'}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        {isLoginMode ? (
                            <>
                                <p>Don't have an account? <button onClick={switchMode} className="link-button">Register</button></p>
                                <p><button onClick={handleForgotPassword} className="link-button">Forgot password?</button></p>
                            </>
                        ) : (
                            <p>Already have an account? <button onClick={switchMode} className="link-button">Login</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;