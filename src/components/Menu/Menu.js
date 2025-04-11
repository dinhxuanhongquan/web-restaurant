import React, { useState } from 'react';
import './Menu.css';
import FoodDetail from '../FoodDetail/FoodDetail';

const Menu = ({ user, setIsLoginOpen }) => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [selectedFood, setSelectedFood] = useState(null);
  
  const menuItems = {
    starters: [
      { id: 1, name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic and basil', price: '89.000 VNĐ', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7f94' },
      { id: 2, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and sweet basil', price: '99.000 VNĐ', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
      { id: 3, name: 'Garlic Bread', description: 'Oven-baked bread with garlic butter and herbs', price: '59.000 VNĐ', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c' }
    ],
    mains: [
      { id: 4, name: 'Spaghetti Carbonara', description: 'Classic carbonara with pancetta and egg', price: '149.000 VNĐ', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3' },
      { id: 5, name: 'Margherita Pizza', description: 'San Marzano tomatoes, mozzarella, fresh basil', price: '129.000 VNĐ', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca' },
      { id: 6, name: 'Risotto ai Funghi', description: 'Creamy risotto with wild mushrooms and parmesan', price: '169.000 VNĐ', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371' }
    ],
    desserts: [
      { id: 7, name: 'Tiramisu', description: 'Coffee-flavored Italian dessert', price: '79.000 VNĐ', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307' },
      { id: 8, name: 'Panna Cotta', description: 'Italian dessert of sweetened cream with gelatin', price: '69.000 VNĐ', image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629' },
      { id: 9, name: 'Cannoli', description: 'Tube-shaped shells filled with sweet cream', price: '89.000 VNĐ', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b' }
    ]
  };

  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handleCloseDetail = () => {
    setSelectedFood(null);
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
            <div 
              className="menu-item" 
              key={item.id}
              onClick={() => handleFoodClick(item)}
            >
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
      
      {selectedFood && (
        <FoodDetail 
          foodId={selectedFood.id} 
          food={selectedFood}
          onClose={() => handleCloseDetail()} 
          isAdmin={user?.isAdmin} 
          user={user}
          setIsLoginOpen={setIsLoginOpen}
        />
      )}
    </section>
  );
};

export default Menu;