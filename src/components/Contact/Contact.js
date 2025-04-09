import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    message: ''
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
    console.log('Reservation data:', formData);
    // Here you would typically send this data to a server
    alert('Reservation request submitted! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: '2',
      date: '',
      time: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-title">
          <h2>Make a Reservation</h2>
          <p>Book your table online</p>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-item">
              <h3>Opening Hours</h3>
              <p>Monday - Friday: 12:00 PM - 11:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
            </div>
            
            <div className="info-item">
              <h3>Location</h3>
              <p>17A Cộng Hòa</p>
              <p>Hồ Chí Minh, VietNam 2025</p>
            </div>
            
            <div className="info-item">
              <h3>Contact</h3>
              <p>Phone: +84 963 689 773</p>
              <p>Email: quandinh.09022003@gmail.com</p>
            </div>
          </div>
          
          <form className="reservation-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="guests">Guests</label>
                <select 
                  id="guests" 
                  name="guests" 
                  value={formData.guests} 
                  onChange={handleChange}
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5 People</option>
                  <option value="6">6+ People</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input 
                  type="time" 
                  id="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Special Requests</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                value={formData.message} 
                onChange={handleChange}
              ></textarea>
            </div>
            
            <button type="submit" className="reservation-btn">Book Table</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;