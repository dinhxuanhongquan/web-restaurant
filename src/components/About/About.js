import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-title">
          <h2>Về chúng tôi</h2>
          <p>Câu chuyện và đam mê ẩm thực của chúng tôi</p>
        </div>
        
        <div className="about-content">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Restaurant interior" />
          </div>
          
          <div className="about-text">
            <h3>Nhà Hàng Truyền Thống - Thành lập 1992</h3>
            <p>
              Được thành lập bởi gia đình Truyền Thống, Nhà Hàng Truyền Thống mang hương vị đích thực của ẩm thực Việt Nam đến tận bàn ăn của bạn. Câu chuyện của chúng tôi được truyền qua nhiều thế hệ.
            </p>
            <p>
              Tại Nhà Hàng Truyền Thống, chúng tôi tin tưởng vào việc sử dụng chỉ những nguyên liệu tươi ngon nhất, được tìm nguồn cung ứng tại địa phương bất cứ khi nào có thể. Đầu bếp của chúng tôi, đã được đào tạo tại một số nhà hàng tốt nhất của Việt Nam trước khi mang kinh nghiệm của mình đến để tạo ra một trải nghiệm ẩm thực kết hợp giữa truyền thống và đổi mới.
            </p>
            <p>
              Chúng tôi mời bạn tham gia bữa ăn và trở thành một phần trong câu chuyện của chúng tôi. Hãy để chúng tôi phục vụ bạn những món ăn ngon nhất, từ những món ăn đường phố đến những món ăn cao cấp, tất cả đều được chế biến với tình yêu và sự chăm sóc.
            </p>

            <div className="features">
              <div className="feature">
                <h4>Nguyên Liệu Chất Lượng</h4>
                <p>Chúng tôi chọn lọc những nguyên liệu tốt nhất, giàu dinh dưỡng.</p>
              </div>
              <div className="feature">
                <h4>Công Thức Truyền Thống</h4>
                <p>Các món ăn của chúng tôi tuân theo những công thức chính thống đã được truyền qua nhiều thế hệ.</p>
              </div>
              <div className="feature">
                <h4>Không Gian Ấm Cúng</h4>
                <p>Trải nghiệm không gian ấm cúng của một bữa tối gia đình Việt Nam .</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;