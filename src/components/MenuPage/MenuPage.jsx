import React, { useState, useEffect } from 'react';
import './MenuPage.css';
import axios from 'axios';

const MenuPage = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dishes and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch dishes
        const dishesResponse = await axios.get('http://localhost:8000/restaurant/dishes');
        setDishes(dishesResponse.data.result || []);
        
        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:8000/restaurant/category-dishes');
        setCategories(categoriesResponse.data.result || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
  };

  const closeModal = () => {
    setSelectedDish(null);
  };

  // Filter dishes by selected category
  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.categoryDish && dish.categoryDish.categoryId === selectedCategory);

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Tất cả món ăn của chúng tôi</h1>
        <p>Khám phá thực đơn đa dạng của chúng tôi</p>

        {/* Category Filter */}
        <div className="category-filter">
          <span>Lọc theo danh mục:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả thực đơn</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Tải thực đơn...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="dishes-container">
          {filteredDishes.length === 0 ? (
            <p className="no-dishes">Không có món ăn nào trong danh mục này.</p>
          ) : (
            filteredDishes.map(dish => (
              <div 
                key={dish.dishId} 
                className="dish-card" 
                onClick={() => handleDishClick(dish)}
              >
                <div className="dish-image">
                  <img 
                    src={dish.dishImage || '/default-dish.jpg'} 
                    alt={dish.dishName} 
                  />
                </div>
                <div className="dish-info">
                  <h3>{dish.dishName}</h3>
                  <p className="dish-price">{dish.dishPrice} VNĐ</p>
                  <p className="dish-category">{dish.categoryDish?.categoryName}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedDish && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="dish-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img 
                  src={selectedDish.dishImage || '/default-dish.jpg'} 
                  alt={selectedDish.dishName} 
                />
              </div>
              
              <div className="modal-details">
                <h2>{selectedDish.dishName}</h2>
                <p className="modal-category">
                  {selectedDish.categoryDish?.categoryName}
                </p>
                <p className="modal-price">{selectedDish.dishPrice} VNĐ</p>

                <div className="modal-description">
                  <h3>Mô tả</h3>
                  <p>{selectedDish.dishDescription}</p>
                </div>
                
                <div className="modal-chef">
                  <h3>Đầu bếp</h3>
                  <p>{selectedDish.nameChef || 'Đầu bếp chính'}</p>
                </div>
                
                <button className="order-button">
                  Thêm vào Đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;