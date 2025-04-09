import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Welcome to La Delizioso</h1>
        <p>Authentic Italian Cuisine in the Heart of the City</p>
        <div className="hero-buttons">
          <button className="btn primary-btn">View Menu</button>
          <button className="btn secondary-btn">Book a Table</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;