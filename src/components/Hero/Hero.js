import React, { useState } from 'react';
import './Hero.css';
import TableReservation from '../TableReservation/TableReservation';

const Hero = () => {
  const [isTableReservationOpen, setIsTableReservationOpen] = useState(false);

  const handleViewMenu = () => {
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookTable = () => {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDetailsTable = () => {
    setIsTableReservationOpen(true);
  }

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Welcome to La Delizioso</h1>
        <p>Authentic Italian Cuisine in the Heart of the City</p>
        <div className="hero-buttons">
          <button className="btn primary-btn" onClick={handleViewMenu}>View Menu</button>
          <button className="btn secondary-btn" onClick={handleBookTable}>Book a Table</button>
          <button className="btn secondary-btn" onClick={handleDetailsTable}>Details Table</button>
        </div>
      </div>
      
      {isTableReservationOpen && (
        <TableReservation 
          isOpen={isTableReservationOpen}
          onClose={() => setIsTableReservationOpen(false)} 
        />
      )}
    </section>
  );
};

export default Hero;