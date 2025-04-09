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

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="App">
      <Header setIsLoginOpen={setIsLoginOpen} />
      <Hero />
      <Menu />
      <About />
      <Contact />
      <GoogleMap />
      <Footer />
      {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} />}
    </div>
  );
}

export default App;
