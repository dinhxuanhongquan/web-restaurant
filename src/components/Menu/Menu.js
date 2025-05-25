import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';
import FoodDetail from '../FoodDetail/FoodDetail';

const Menu = ({ user, setIsLoginOpen }) => {
  const [categories, setCategories] = useState([]); // Đảm bảo khởi tạo là array
  const [dishes, setDishes] = useState([]); // Đảm bảo khởi tạo là array
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/restaurant/category-dishes`);
      
      // Kiểm tra xem response.data có phải là array không
      if (Array.isArray(response.data?.result)) {
        setCategories(response.data.result);
        setActiveCategory(response.data.result[0]?.categoryId); // Set the first category as active by default
      } else {
        console.error('Categories data is not an array:', response.data);
        setCategories([]); // Set về array rỗng nếu không phải array
        setError('Invalid categories data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Đặt về array rỗng khi có lỗi
      setError('Error fetching categories');
    }
  };

  const fetchDishes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/restaurant/dishes`);
      
      // Kiểm tra xem response.data có phải là array không
      if (Array.isArray(response.data?.result)) {
        setDishes(response.data.result);
      } else {
        console.error('Dishes data is not an array:', response.data);
        setDishes([]); // Set về array rỗng nếu không phải array
        setError('Invalid dishes data format');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setDishes([]); // Đặt về array rỗng khi có lỗi
      setError('Error fetching dishes');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDishes();
  }, []);

  const handleFoodClick = async (dishId) => {
    try {
      const response = await axios.get(`http://localhost:8000/restaurant/dishes/${dishId}`);
      if (response.data?.result) {
        setSelectedFood(response.data.result);
        localStorage.setItem('dishId', dishId);
      }
    } catch (error) {
      console.error('Error fetching dish details:', error);
      setError("Error fetching dish details");
    }
  };

  const handleCloseDetail = () => {
    setSelectedFood(null);
    localStorage.removeItem('dishId');
  };

  // Đảm bảo dishes là array trước khi filter
  const filteredDishes = activeCategory && Array.isArray(dishes)
    ? dishes.filter(dish => dish.categoryDish && dish.categoryDish.categoryId === activeCategory)
    : Array.isArray(dishes) ? dishes : [];

  if (isLoading) {
    return <div className="loading">Đang tải thực đơn...</div>;
  }

  if (error) {
    return <div className="error-message">{typeof error === 'string' ? error : 'Đã xảy ra lỗi'}</div>;
  }

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="section-title">
          <h2>Thực Đơn Của Chúng Tôi</h2>
          <p>Khám phá những món ăn ngon miệng của chúng tôi </p>
        </div>
        
        <div className="menu-tabs">
          {/* Kiểm tra categories là array trước khi map */}
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map(category => (
              <button 
                key={category.categoryId}
                className={activeCategory === category.categoryId ? 'active' : ''}
                onClick={() => setActiveCategory(category.categoryId)}
              >
                {category.categoryName}
              </button>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
        
        <div className="menu-items">
          {filteredDishes.length > 0 ? (
            filteredDishes.map(dish => (
              <div 
                className="menu-item" 
                key={dish.dishId}
                onClick={() => handleFoodClick(dish.dishId)}
              >
                <div className="menu-item-img">
                  <img src={dish.dishImage || 'https://via.placeholder.com/150'} alt={dish.dishName} />
                </div>
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h3>{dish.dishName}</h3>
                    <span className="price">{dish.dishPrice} VNĐ</span>
                  </div>
                  <p>{dish.dishDescription}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">No dishes available in this category</p>
          )}
        </div>
      </div>
      
      {selectedFood && (
        <FoodDetail 
          foodId={selectedFood.dishId} 
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