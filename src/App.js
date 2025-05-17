import React, { useState } from 'react';
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


function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [user, setUser] = useState(null); // null means not logged in

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    // Không cần mở thanh Admin nếu không cần thiết
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      <Header 
        setIsLoginOpen={setIsLoginOpen} 
        user={user} 
        onLogout={handleLogout} 
        setIsAdminPanelOpen={() => setIsAdminPanelOpen(true)} // Đổi tên prop cho khớp
      />
      <Hero />
      <Menu 
        user={user} 
        setIsLoginOpen={setIsLoginOpen}
      />
      <About />
      <Contact />
      <Footer />
      <GoogleMap />
      {isLoginOpen && (
        <Login 
          setIsLoginOpen={setIsLoginOpen} 
          onLogin={handleLogin} 
        />
      )}
      
      {isAdminPanelOpen && user?.isAdmin && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}
    </div>
  );
}

export default App;