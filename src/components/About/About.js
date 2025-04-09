import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-title">
          <h2>About Us</h2>
          <p>Our story and passion for food</p>
        </div>
        
        <div className="about-content">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Restaurant interior" />
          </div>
          
          <div className="about-text">
            <h3>La Delizioso - Established 1992</h3>
            <p>
              Founded by the Rossi family, La Delizioso brings the authentic flavors of Italian cuisine to your table. Our story begins in a small town near Naples, where our recipes have been passed down through generations.
            </p>
            <p>
              At La Delizioso, we believe in using only the freshest ingredients, sourced locally whenever possible. Our chef, Antonio Rossi, trained in some of Italy's finest restaurants before bringing his expertise to create a dining experience that combines tradition with innovation.
            </p>
            <p>
              We invite you to join us for a meal and become part of our story. Whether you're celebrating a special occasion or simply enjoying a night out, we promise an unforgettable culinary journey.
            </p>
            
            <div className="features">
              <div className="feature">
                <h4>Quality Ingredients</h4>
                <p>We source the finest ingredients, many imported directly from Italy.</p>
              </div>
              <div className="feature">
                <h4>Traditional Recipes</h4>
                <p>Our dishes follow authentic recipes passed through generations.</p>
              </div>
              <div className="feature">
                <h4>Warm Atmosphere</h4>
                <p>Experience the welcoming ambiance of an Italian family dinner.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;