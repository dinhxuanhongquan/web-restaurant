import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Menu from './components/Menu/Menu';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import AdminPanel from './components/Admin/AdminPanel';
import GoogleMap from './components/GoogleMap/GoogleMap';
import ProfilePage from './components/ProfilePage/ProfilePage';
import  MenuPage from './components/MenuPage/MenuPage';
import { getCurrentUser, logoutUser } from './services/authService';


function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuPageOpen, setIsMenuPageOpen] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const userInfo = getCurrentUser();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    // If admin panel is open, close it
    if (isAdminPanelOpen) {
      setIsAdminPanelOpen(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    // Không cần mở thanh Admin nếu không cần thiết
  };

  const handleOpenAdminPanel = () => {
    setIsAdminPanelOpen(true);
  };

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
  };

  const handleOpenProfile = () => {
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };
  const handleOpenMenuPage = () => {
    setIsMenuPageOpen(true);
  }
  const handleCloseMenuPage = () => {
    setIsMenuPageOpen(false);
  };

  return (
    <div className="App">
      <Header 
        setIsLoginOpen={setIsLoginOpen} 
        user={user} 
        onLogout={handleLogout}
        setIsAdminPanelOpen={handleOpenAdminPanel}
        setIsProfileOpen={handleOpenProfile} 
        setIsMenuPageOpen={handleOpenMenuPage}
      />
      <Hero />
      <Menu 
        user={user} 
        setIsLoginOpen={setIsLoginOpen}
      />
      <About />
      <Contact setIsLoginOpen={setIsLoginOpen} 
        user={user}
      />
      <Footer />
      <GoogleMap />
      {isLoginOpen && (
        <Login 
          setIsLoginOpen={setIsLoginOpen} 
          onLogin={handleLogin} 
        />
      )}
      
      {isAdminPanelOpen && user?.isAdmin && (
        <AdminPanel onClose={handleCloseAdminPanel} />
      )}
      
      {isProfileOpen && user && (
        <ProfilePage onClose={handleCloseProfile} user={user} />
      )}
      
      {isMenuPageOpen && (
        <div className="menu-page-overlay">
          <button onClick={handleCloseMenuPage} className="close-menu-button">X</button>
          <MenuPage onClose={handleCloseMenuPage} />
        </div>
      )}
    </div>
  );
}

export default App;