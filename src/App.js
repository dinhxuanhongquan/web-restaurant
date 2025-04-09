import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Menu from './components/Menu/Menu';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import GoogleMap from './components/GoogleMap/GoogleMap';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import AdminPanel from './components/Admin/AdminPanel';
import TableReservation from './components/TableReservation/TableReservation';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTableReservationOpen, setIsTableReservationOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleAdminPanel = () => {
    setIsAdminPanelOpen(!isAdminPanelOpen);
  };

  return (
    <div className="App">
      <Header 
        setIsLoginOpen={setIsLoginOpen} 
        setIsTableReservationOpen={setIsTableReservationOpen}
        user={user} 
        onLogout={handleLogout}
        isAdmin={user?.username === 'admin'}
        toggleAdminPanel={toggleAdminPanel}
      />
      <Hero setIsTableReservationOpen={setIsTableReservationOpen} />
      <Menu />
      <About />
      <Contact setIsTableReservationOpen={setIsTableReservationOpen} />
      <GoogleMap />
      <Footer />
      {isLoginOpen && (
        <Login 
          setIsLoginOpen={setIsLoginOpen} 
          onLogin={handleLogin}
        />
      )}
      {isAdminPanelOpen && user?.username === 'admin' && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}
      {isTableReservationOpen && (
        <TableReservation 
          isOpen={isTableReservationOpen}
          onClose={() => setIsTableReservationOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
