import React, { useState } from 'react';
import './Hero.css';
import TableReservation from '../TableReservation/TableReservation';

const Hero = () => {
  const [isTableReservationOpen, setIsTableReservationOpen] = useState(false);

  const handleBookTable = () => {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDetailsTable = () => {
    setIsTableReservationOpen(true);
  }

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Chào mừng đến với Nhà Hàng Truyền Thống</h1>
        <p>Ẩm thực Việt Nam đích thực ngay giữa lòng thành phố</p>
        <div className="hero-buttons">
          <button className="btn secondary-btn" onClick={handleBookTable}>Đặt Bàn</button>
          <button className="btn secondary-btn" onClick={handleDetailsTable}>Chi Tiết Bàn</button>
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