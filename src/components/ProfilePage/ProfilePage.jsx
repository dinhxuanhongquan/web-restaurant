import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = ({ onClose, user: initialUser }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start with loading state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    const [avatarPreview, setAvatarPreview] = useState('');
    
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        avatar: null
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    
    // Ngăn click sự kiện lan truyền đến overlay
    const handleModalClick = (e) => {
        e.stopPropagation();
    };
    
    // Hàm kiểm tra kết nối API
    const testAPIConnection = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
                setIsLoading(false);
                return;
            }
            
            console.log("Testing API connection...");
            
            // Single API call
            const response = await axios.get(
                'http://localhost:8000/restaurant/users/me',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log("API test successful:", response);
            setSuccess("Kết nối API thành công!");
            
            // Process user data if available
            if (response.data && response.data.result) {
                setUser(response.data.result);
                // Update other state as needed...
            }
        } catch (error) {
            console.error("API test failed:", error);
            console.error("Full error object:", JSON.stringify(error, null, 2));
            
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || error.message;
            
            // Handle different error scenarios
            if (statusCode === 401) {
                setError("Token hết hạn hoặc không hợp lệ. Hãy đăng nhập lại.");
            } else if (statusCode === 403) {
                setError("Bạn không có quyền truy cập tài nguyên này.");
            } else {
                setError(`Lỗi API (${statusCode || 'unknown'}): ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Initialize user data when it changes
    useEffect(() => {
        if (!user) return;
        
        console.log("User data updated, initializing profileData", user);
        
        setProfileData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            dateOfBirth: user.dob || '',
            avatar: user.image || ''
        });
        
        // Set avatar preview if user has an image
        if (user.image) {
            console.log("Setting avatar from user image:", user.image);
            // Nếu user.image là URL đầy đủ
            if (user.image.startsWith('http')) {
                setAvatarPreview(user.image);
            } 
            // Nếu user.image chỉ là tên file (như trong ví dụ "image03")
            else {
                // Sử dụng placeholder nếu không có URL thực
                setAvatarPreview('https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png');
            }
        }
    }, [user]);
    
    // Tải dữ liệu người dùng khi component được khởi tạo
    useEffect(() => {
        // Nếu bạn đã có dữ liệu user từ props hoặc trong localStorage
        const userDataFromProps = initialUser;
        
        // Nếu có dữ liệu từ props, sử dụng nó
        if (userDataFromProps) {
            console.log("Setting user from props:", userDataFromProps);
            setUser(userDataFromProps);
            setIsLoading(false);
            return;
        }
        
        // Hoặc có thể bạn lưu dữ liệu trong localStorage
        const userDataFromStorage = localStorage.getItem('userData');
        if (userDataFromStorage) {
            try {
                const parsedData = JSON.parse(userDataFromStorage);
                console.log("Setting user from localStorage:", parsedData);
                setUser(parsedData);
                setIsLoading(false);
                return;
            } catch (e) {
                console.error("Error parsing user data from localStorage:", e);
            }
        }
        
        // Nếu không có dữ liệu sẵn, gọi API
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log("No token found");
                    setError('Bạn cần đăng nhập để xem trang này');
                    setIsLoading(false);
                    return;
                }
                
                console.log("Fetching user data with token:", token);
                
                // Gọi API thực tế thay vì sử dụng mock data
                try {
                    const response = await axios.get(
                        'http://localhost:8000/restaurant/users/me',
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    
                    console.log("API Response:", response.data);
                    
                    if (response.data && response.data.result) {
                        setUser(response.data.result);
                    } else {
                        setError('Cấu trúc dữ liệu không đúng định dạng');
                    }
                } catch (apiErr) {
                    // Xử lý lỗi API chi tiết
                    console.error('Error from API call:', apiErr);
                    
                    const statusCode = apiErr.response?.status;
                    const errorMessage = apiErr.response?.data?.message || apiErr.message;
                    
                    console.log(`API Error - Status: ${statusCode}, Message: ${errorMessage}`);
                    
                    if (statusCode === 401) {
                        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    } else if (statusCode === 404) {
                        setError('API endpoint không tồn tại. Vui lòng kiểm tra cấu hình API.');
                    } else if (!statusCode) {
                        setError('Không thể kết nối đến server. Vui lòng đảm bảo backend đang chạy.');
                    } else {
                        setError(`Lỗi API (${statusCode}): ${errorMessage}`);
                    }
                }
            } catch (err) {
                console.error('Error in fetch function:', err);
                setError('Lỗi khi tải dữ liệu: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [initialUser]);
    
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
        setError('');
        setSuccess('');
    };
    
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({
                ...profileData,
                avatar: file
            });
            
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setError('');
        setSuccess('');
    };
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
        setError('');
        setSuccess('');
    };
    
    const updateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Bạn cần đăng nhập để thực hiện hành động này');
                setIsLoading(false);
                return;
            }
            
            const formData = new FormData();
            formData.append('firstName', profileData.firstName);
            formData.append('lastName', profileData.lastName);
            formData.append('email', profileData.email);
            formData.append('phoneNumber', profileData.phoneNumber);
            formData.append('dob', profileData.dateOfBirth);
            
            
            if (profileData.avatar && typeof profileData.avatar !== 'string') {
                formData.append('image', profileData.avatar);
            }
            
            console.log("Updating profile with data:", Object.fromEntries(formData));
            
            const response = await axios.put(
                `http://localhost:8000/restaurant/users/me`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            console.log("Update response:", response.data);
            
            // Update user data with the response
            if (response.data && response.data.result) {
                setUser(response.data.result);
            }
            
            setSuccess('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Error updating profile:', error);
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || error.message;
            
            setError(`Không thể cập nhật thông tin (${statusCode || 'unknown'}): ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const changePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            setIsLoading(false);
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Bạn cần đăng nhập để thực hiện hành động này');
                setIsLoading(false);
                return;
            }
            
            console.log("Changing password...");
            
            await axios.post(
                `http://localhost:8000/restaurant/users/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setSuccess('Đổi mật khẩu thành công!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || error.message;
            
            setError(`Không thể đổi mật khẩu (${statusCode || 'unknown'}): ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={handleModalClick}>
                <div className="profile-modal-header">
                    <h2>Thông tin tài khoản</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="profile-modal-content">
                    {isLoading ? (
                        <div className="loading-spinner">Đang tải dữ liệu người dùng...</div>
                    ) : error ? (
                        <div className="error-message">
                            {error}
                            {/* <button 
                                className="test-api-btn"
                                onClick={testAPIConnection}
                                style={{ marginTop: '10px', padding: '5px 10px' }}
                            >
                                Kiểm tra kết nối API
                            </button> */}
                        </div>
                    ) : !user ? (
                        <div className="error-message">
                            <p>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
                            {/* <button 
                                className="test-api-btn"
                                onClick={testAPIConnection}
                                style={{ marginTop: '10px', padding: '5px 10px' }}
                            >
                                Kiểm tra kết nối API
                            </button> */}
                        </div>
                    ) : (
                        <>
                            <div className="profile-avatar-container">
                                <img 
                                    // Su dung avatarPreview de hien thi hinh anh khong co thi dung cung thu folder public
                                    src={avatarPreview || 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'}
                                    alt="Avatar" 
                                    className="profile-avatar"
                                    style={
                                        { 
                                            width: '100px', 
                                            height: '100px', 
                                            borderRadius: '50%' 
                                        }}
                                />
                                <div className="profile-username">{user.username}</div>
                                <div className="profile-role">
                                    {user.roles && user.roles.map(role => (
                                        <span key={role.roleName} className="role-badge">
                                            {role.roleName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="profile-tabs">
                                <button 
                                    className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} 
                                    onClick={testAPIConnection}
                                >
                                    Thông tin cá nhân
                                </button>
                                <button 
                                    className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`} 
                                    onClick={() => setActiveTab('password')}
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                            
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            
                            {activeTab === 'info' ? (
                                <form onSubmit={updateProfile}>
                                    {/* user id khong the thay doi */}
                                    <div className="form-group">
                                        <label htmlFor="userId">ID người dùng</label>
                                        <input
                                            type="text"
                                            id="userId"
                                            value={user.userId || ''}
                                            disabled
                                        />
                                        <span className="form-note">ID người dùng không thể thay đổi</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username">Tên đăng nhập</label>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            value={user.username || ''} 
                                            disabled 
                                        />
                                        <span className="form-note">Tên đăng nhập không thể thay đổi</span>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="firstName">Họ</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            name="firstName" 
                                            value={profileData.firstName} 
                                            onChange={handleProfileChange} 
                                            placeholder="Nhập họ"
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="lastName">Tên</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            name="lastName" 
                                            value={profileData.lastName} 
                                            onChange={handleProfileChange} 
                                            placeholder="Nhập tên"
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={profileData.email} 
                                            onChange={handleProfileChange}
                                            placeholder="Nhập email"
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Số điện thoại</label>
                                        <input 
                                            type="tel" 
                                            id="phoneNumber" 
                                            name="phoneNumber" 
                                            value={profileData.phoneNumber} 
                                            onChange={handleProfileChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="dateOfBirth">Ngày sinh</label>
                                        <input 
                                            type="date" 
                                            id="dateOfBirth" 
                                            name="dateOfBirth" 
                                            value={profileData.dateOfBirth} 
                                            onChange={handleProfileChange} 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="avatar">Ảnh đại diện</label>
                                        <input 
                                            type="file" 
                                            id="avatar" 
                                            name="avatar" 
                                            accept="image/*" 
                                            onChange={handleAvatarChange} 
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="profile-submit-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={changePassword}>
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                                        <input 
                                            type="password" 
                                            id="currentPassword" 
                                            name="currentPassword" 
                                            value={passwordData.currentPassword} 
                                            onChange={handlePasswordChange}
                                            placeholder="Nhập mật khẩu hiện tại"
                                            required 
                                            minLength={6} 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="newPassword">Mật khẩu mới</label>
                                        <input 
                                            type="password" 
                                            id="newPassword" 
                                            name="newPassword" 
                                            value={passwordData.newPassword} 
                                            onChange={handlePasswordChange}
                                            placeholder="Nhập mật khẩu mới"
                                            required 
                                            minLength={6} 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
                                        <input 
                                            type="password" 
                                            id="confirmNewPassword" 
                                            name="confirmNewPassword" 
                                            value={passwordData.confirmNewPassword} 
                                            onChange={handlePasswordChange}
                                            placeholder="Nhập lại mật khẩu mới"
                                            required 
                                            minLength={6} 
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="profile-submit-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                    </button>
                                </form>
                            )}
                            
                            {/* Thêm nút kiểm tra kết nối API */}
                            {/* <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button 
                                    className="test-api-btn"
                                    onClick={testAPIConnection}
                                    style={{ 
                                        padding: '8px 15px',
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Kiểm tra kết nối API
                                </button>
                            </div> */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;