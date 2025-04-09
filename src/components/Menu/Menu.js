import React, { useState } from 'react';
import './Menu.css';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('starters');
  
  const menuItems = {
    starters: [
      { id: 1, name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic and basil', price: '$8.99', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7f94?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { id: 2, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and sweet basil', price: '$9.99', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { id: 3, name: 'Garlic Bread', description: 'Oven-baked bread with garlic butter and herbs', price: '$5.99', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }
    ],
    mains: [
      { id: 1, name: 'Spaghetti Carbonara', description: 'Classic carbonara with pancetta and egg', price: '$14.99', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { id: 2, name: 'Margherita Pizza', description: 'San Marzano tomatoes, mozzarella, fresh basil', price: '$12.99', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { id: 3, name: 'Risotto ai Funghi', description: 'Creamy risotto with wild mushrooms and parmesan', price: '$16.99', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }
    ],
    desserts: [
      { id: 1, name: 'Tiramisu', description: 'Coffee-flavored Italian dessert', price: '$7.99', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { id: 2, name: 'Panna Cotta', description: 'Italian dessert of sweetened cream thickened with gelatin', price: '$6.99', image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
      { id: 3, name: 'Cannoli', description: 'Tube-shaped shells of fried pastry dough filled with sweet cream', price: '$8.99', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }
    ]
  };

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="section-title">
          <h2>Our Menu</h2>
          <p>Explore our delicious offerings</p>
        </div>
        
        <div className="menu-tabs">
          <button 
            className={activeCategory === 'starters' ? 'active' : ''}
            onClick={() => setActiveCategory('starters')}
          >
            Starters
          </button>
          <button 
            className={activeCategory === 'mains' ? 'active' : ''}
            onClick={() => setActiveCategory('mains')}
          >
            Main Courses
          </button>
          <button 
            className={activeCategory === 'desserts' ? 'active' : ''}
            onClick={() => setActiveCategory('desserts')}
          >
            Desserts
          </button>
        </div>
        
        <div className="menu-items">
          {menuItems[activeCategory].map(item => (
            <div className="menu-item" key={item.id}>
              <div className="menu-item-img">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="menu-item-info">
                <div className="menu-item-header">
                  <h3>{item.name}</h3>
                  <span className="price">{item.price}</span>
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;