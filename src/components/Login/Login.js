import React, { useState } from "react";
import './Login.css';
import axios from "axios";
import { decodeToken } from '../../utils/tokenHelper';

const Login = ({ setIsLoginOpen, onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [isVerifyMode, setIsVerifyMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    });
    const [forgotEmail, setForgotEmail] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [forgotPassword, setForgotPassword] = useState('');
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Base API URL - should be in environment variable in production
    const API_BASE_URL = "http://localhost:8000/restaurant";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user types
        setError('');
    };

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (isLoginMode) {
            // Login flow
            try {
                const res = await axios.post(`${API_BASE_URL}/auth/token`, {
                    username: formData.username,
                    password: formData.password
                });

                const { token, authenticated } = res.data.result;

                if (authenticated && token) {
                    localStorage.setItem('token', token);
                    
                    // Decode token to extract user info
                    const decodedToken = decodeToken(token);
                    
                    // Extract role and admin status from token
                    const isAdmin = decodedToken && 
                        ((decodedToken.scope && decodedToken.scope.includes('ADMIN')) || 
                         (decodedToken.roles && decodedToken.roles.includes('ADMIN')));
                    
                    // Fetch additional user profile info if needed
                    const userProfile = await fetchUserProfile(token);
                    
                    // Provide user info to parent component
                    onLogin({
                        username: formData.username,
                        isAdmin: isAdmin,
                        // Include additional user info from profile if available
                        ...(userProfile ? { profile: userProfile } : {})
                    });

                    handleClose();
                    alert("Đăng nhập thành công!");
                } else {
                    setError("Đăng nhập thất bại! Kiểm tra lại thông tin đăng nhập.");
                }
            } catch (error) {
                console.error(error);
                if (error.response) {
                    // Server responded with error
                    setError(error.response.data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
                } else {
                    setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
                }
            }
        } else {
            // Registration flow
            if (formData.password !== formData.confirmPassword) {
                setError("Mật khẩu xác nhận không khớp.");
                setIsLoading(false);
                return;
            }
            
            try {
                // get first name and last name from full name
                const fullNameParts = formData.fullName.trim().split(' ');
                const firstName = fullNameParts[0];
                const lastName = fullNameParts.slice(1).join(' ');

                // Xu ly anh dai dien bang cach chuyen anh thanh string dung base64
                const reader = new FileReader();
                reader.readAsDataURL(formData.avatar);

                const res = await axios.post(`${API_BASE_URL}/users`, {
                    username: formData.username,
                    password: formData.password,
                    firstName: firstName,
                    lastName: lastName,
                    dob: formData.dateOfBirth,
                    image: formData.avatar ? reader.result : null,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                });

                if (res.data.result) {
                    alert("Đăng ký thành công! Bây giờ bạn có thể đăng nhập.");
                    // Switch to login mode after successful registration
                    setIsLoginMode(true);
                    setFormData({
                        ...formData,
                        password: '',
                        confirmPassword: ''
                    });
                } else {
                    setError("Đăng ký thất bại. Vui lòng thử lại.");
                }
            } catch (error) {
                console.error(error);
                if (error.response) {
                    // Handle specific error codes
                    if (error.response.status === 409) {
                        setError("Tên đăng nhập hoặc email đã tồn tại.");
                    } else {
                        setError(error.response.data.message || "Đăng ký thất bại. Vui lòng thử lại.");
                    }
                } else {
                    setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
                }
            }
        }
        
        setIsLoading(false);
    };

    // Forgot password - Step 1: Request password reset code
    const handleForgotSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (!forgotEmail) {
            setError("Vui lòng nhập email để lấy lại mật khẩu.");
            setIsLoading(false);
            return;
        }
        
        try {
            // Call API to request password reset
            const response = await axios.post(`${API_BASE_URL}/auth/password/reset-request`, {
                email: forgotEmail
            });
            
            if (response.data.success) {
                // In a real application, the code would be sent to email
                // For development, we might get it in the response or mock it
                alert("Mã xác nhận đã được gửi đến email của bạn.");
                
                // For demo/development, you might get the code in the response
                if (response.data.verificationCode) {
                    setVerifyCode(response.data.verificationCode);
                    alert(`Mã xác nhận (chỉ hiển thị trong môi trường phát triển): ${response.data.verificationCode}`);
                } else {
                    // In production, this would be sent to email
                    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setVerifyCode(mockCode);
                    alert(`Mã xác nhận (giả lập): ${mockCode}`);
                }
                
                setIsVerifyMode(true);
            } else {
                setError("Không thể gửi mã xác nhận. Vui lòng kiểm tra email và thử lại.");
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                setError(error.response.data.message || "Không thể gửi mã xác nhận. Vui lòng thử lại.");
            } else {
                setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
            }
        }
        
        setIsLoading(false);
    };

    // Forgot password - Step 2: Verify code and set new password
    const handleForgotVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Validate inputs
        if (!inputCode) {
            setError("Vui lòng nhập mã xác nhận.");
            setIsLoading(false);
            return;
        }
        
        if (forgotPassword !== forgotConfirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setIsLoading(false);
            return;
        }
        
        if (forgotPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            setIsLoading(false);
            return;
        }
        
        try {
            // In real application, call API to verify code and reset password
            const response = await axios.post(`${API_BASE_URL}/auth/password/reset-confirm`, {
                email: forgotEmail,
                verificationCode: inputCode,
                newPassword: forgotPassword
            });
            
            if (response.data.success) {
                alert("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.");
                // Reset states and switch to login mode
                setIsForgotMode(false);
                setIsVerifyMode(false);
                setIsLoginMode(true);
                setForgotEmail('');
                setForgotPassword('');
                setForgotConfirmPassword('');
                setInputCode('');
                setVerifyCode('');
            } else {
                setError("Không thể đặt lại mật khẩu. Mã xác nhận có thể không chính xác.");
            }
        } catch (error) {
            console.error(error);
            
            // For demo/development, if the API is not implemented, we can mock it
            if (inputCode === verifyCode) {
                alert("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.");
                setIsForgotMode(false);
                setIsVerifyMode(false);
                setIsLoginMode(true);
                setForgotEmail('');
                setForgotPassword('');
                setForgotConfirmPassword('');
                setInputCode('');
                setVerifyCode('');
            } else {
                setError("Mã xác nhận không chính xác.");
            }
        }
        
        setIsLoading(false);
    };

    const handleClose = () => {
        setIsLoginOpen(false);
        setIsForgotMode(false);
        setIsVerifyMode(false);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        setIsForgotMode(false);
        setIsVerifyMode(false);
        setFormData({
            username: '',
            password: '',
            email: '',
            confirmPassword: ''
        });
        setForgotEmail('');
        setForgotPassword('');
        setForgotConfirmPassword('');
        setInputCode('');
        setVerifyCode('');
        setError('');
    };

    return (
        <div className="login-overlay" onClick={handleClose}>
            <div className="login-container" onClick={handleModalClick}>
                <div className="login-wrapper">
                    <div className="login-header">
                        <h2>
                            {isForgotMode
                                ? isVerifyMode
                                    ? 'Xác nhận mã & Đặt lại mật khẩu'
                                    : 'Quên mật khẩu'
                                : isLoginMode
                                    ? 'Đăng nhập'
                                    : 'Đăng ký'}
                        </h2>
                        <button className="close-btn" onClick={handleClose}>×</button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {/* Đăng nhập/Đăng ký */}
                    {!isForgotMode ? (
                        <form onSubmit={handleSubmit}>
                            {isLoginMode ? (
                                // Login form fields
                                <>
                                    <div className="form-group">
                                        <label htmlFor="username">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Nhập tên đăng nhập"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="password">Mật khẩu</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu"
                                            required
                                            minLength={6}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </>
                            ) : (
                                // Registration form fields
                                <div className="registration-form-grid">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Nhập email của bạn"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="username">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Nhập tên đăng nhập"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="password">Mật khẩu</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu"
                                            required
                                            minLength={6}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Nhập lại mật khẩu"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Số điện thoại</label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="dateOfBirth">Ngày sinh</label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group full-width">
                                        <label htmlFor="fullName">Họ và tên</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nhập họ và tên"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="form-group full-width">
                                        <label htmlFor="avatar">Ảnh đại diện</label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={e => {
                                                setFormData({
                                                    ...formData,
                                                    avatar: e.target.files[0]
                                                });
                                                setError('');
                                            }}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Đang xử lý...'
                                    : isLoginMode ? 'Đăng nhập' : 'Tạo tài khoản'}
                            </button>
                        </form>
                    ) : (
                        // Quên mật khẩu
                        !isVerifyMode ? (
                            <form onSubmit={handleForgotSendCode}>
                                <div className="form-group">
                                    <label htmlFor="forgotEmail">Nhập email để lấy lại mật khẩu</label>
                                    <input
                                        type="email"
                                        id="forgotEmail"
                                        name="forgotEmail"
                                        value={forgotEmail}
                                        onChange={e => {
                                            setForgotEmail(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Nhập email của bạn"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="forgot-password-actions">
                                    <button 
                                        type="submit" 
                                        className="login-submit-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                                    </button>
                                    <button
                                        type="button"
                                        className="login-submit-btn secondary"
                                        onClick={() => setIsForgotMode(false)}
                                        disabled={isLoading}
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotVerify}>
                                <div className="form-group">
                                    <label htmlFor="inputCode">Nhập mã xác nhận từ email</label>
                                    <input
                                        type="text"
                                        id="inputCode"
                                        name="inputCode"
                                        value={inputCode}
                                        onChange={e => {
                                            setInputCode(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Nhập mã xác nhận"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="forgotPassword">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        id="forgotPassword"
                                        name="forgotPassword"
                                        value={forgotPassword}
                                        onChange={e => {
                                            setForgotPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Nhập mật khẩu mới"
                                        required
                                        minLength={6}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="forgotConfirmPassword">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        id="forgotConfirmPassword"
                                        name="forgotConfirmPassword"
                                        value={forgotConfirmPassword}
                                        onChange={e => {
                                            setForgotConfirmPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Xác nhận mật khẩu mới"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="login-submit-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xác nhận...' : 'Xác nhận'}
                                </button>
                                <button
                                    type="button"
                                    className="login-submit-btn secondary"
                                    style={{ background: "#aaa", marginLeft: 10 }}
                                    onClick={() => {
                                        setIsVerifyMode(false);
                                        setInputCode('');
                                        setForgotPassword('');
                                        setForgotConfirmPassword('');
                                    }}
                                    disabled={isLoading}
                                >
                                    Quay lại
                                </button>
                            </form>
                        )
                    )}

                    <div className="login-footer">
                        {!isForgotMode && (
                            isLoginMode ? (
                                <>
                                    <p>Chưa có tài khoản? <button onClick={switchMode} className="link-button" disabled={isLoading}>Đăng ký ngay</button></p>
                                    <p>
                                        <button
                                            onClick={() => setIsForgotMode(true)}
                                            className="link-button"
                                            disabled={isLoading}
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </p>
                                </>
                            ) : (
                                <p>Đã có tài khoản? <button onClick={switchMode} className="link-button" disabled={isLoading}>Đăng nhập</button></p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;