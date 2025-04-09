import React, { useState } from "react";
import './Login.css';

const Login = ({ setIsLoginOpen }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
        console.log('Login data:', formData);
        alert('Login attempt with: ' + formData.username);
        // 
    };

    const handleClose = () => {
        setIsLoginOpen(false);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleRegister = () => {
        console.log("Registration functionality will be implemented here");
        // Here you could open a registration modal or navigate to registration page
    };

    const handleForgotPassword = () => {
        console.log("Forgot password functionality will be implemented here");
        // Here you could open a password reset modal
    };

    return (
        <div className="login-overlay" onClick={handleClose}>
            <div className="login-container" onClick={handleModalClick}>
                <div className="login-wrapper">
                    <div className="login-header">
                        <h2>Login</h2>
                        <button className="close-btn" onClick={handleClose}>×</button>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="login-submit-btn">Login</button>
                    </form>
                    <div className="login-footer">
                        <p>Don't have an account? <button onClick={handleRegister} className="link-button">Register</button></p>
                        <p><button onClick={handleForgotPassword} className="link-button">Forgot password?</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;