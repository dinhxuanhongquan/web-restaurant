import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';
import TableReservation from '../TableReservation/TableReservation';

const Contact = ({setIsLoginOpen, user}) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Thêm state để kiểm tra đăng nhập
  const [isTableReservationOpen, setIsTableReservationOpen] = useState(false);

  const [formData, setFormData] = useState({
    bookingTime: '',
    tableId: '',
  });

  // Kiểm tra token khi component mount và cập nhật trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Chuyển token sang boolean
    
    if (token) {
      fetchTables();
    } else {
      setLoading(false);
    }
  }, [user]);

  // fetching data from the API
  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8000/restaurant/tables', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.result) {
        setTables(response.data.result);
      } else {
        console.error("No tables found");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  // Các hàm xử lý khác giữ nguyên...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDetailsTable = () => {
    setIsTableReservationOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Bạn cần đăng nhập để đặt bàn.");
        setIsLoginOpen(true);
        return;
      }
      // Check booking time
      const currentTime = new Date();
      const bookingTime = new Date(formData.bookingTime);
      if (bookingTime <= currentTime || (bookingTime - currentTime) < 3600000) {
        alert("Thời gian đặt bàn phải ít nhất 1 giờ sau thời điểm hiện tại.");
        return;
      }

      const response = await axios.post(`http://localhost:8000/restaurant/bookings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.result) {
        alert("Đặt bàn thành công!");

        // goi lại hàm fetchTables để cập nhật danh sách bàn
        fetchTables();

        // Reset form data
        setFormData({
          bookingTime: '',
          tableId: ''
        });
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Đặt bàn không thành công. Vui lòng thử lại sau.");
    }
  };

  // Hàm xử lý đăng nhập
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-title">
          <h2>Thực hiện Đặt chỗ</h2>
          <p>Đặt bàn trực tuyến</p>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <div className="info-item">
              <h3>Giờ mở cửa</h3>
              <p>Thứ Hai - Thứ Sáu: 12:00 PM - 11:00 PM</p>
              <p>Thứ Bảy - Chủ Nhật: 10:00 AM - 11:00 PM</p>
            </div>
            
            <div className="info-item">
              <h3>Địa chỉ</h3>
              <p>17A Cộng Hòa</p>
              <p>Hồ Chí Minh, VietNam 2025</p>
            </div>
            
            <div className="info-item">
              <h3>Liên hệ</h3>
              <p>Điện thoại: +84 963 689 773</p>
              <p>Email: quandinh.09022003@gmail.com</p>
            </div>
          </div>
          
          {isLoggedIn ? (
            // Hiển thị form đặt bàn chỉ khi người dùng đã đăng nhập
            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tableId">Số ghế ngồi</label>
                  <select 
                    name="tableId" 
                    value={formData.tableId} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Vui lòng chọn bàn --</option>
                    {tables
                      .filter(table => table.tableStatus !== 'BOOKED')
                      .map(table => (
                        <option key={table.tableId} value={table.tableId}>
                          {table.tableName} - {table.tableSeat} ghế
                        </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Thời gian</label>
                  <input 
                    type="datetime-local" 
                    id="bookingTime" 
                    name="bookingTime" 
                    value={formData.bookingTime} 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="reservation-btn">Đặt bàn</button>
              <div>
                <button type="button" className="details-btn" onClick={handleDetailsTable}>
                  Chi tiết bàn
                </button>
              </div>
            </form>
          ) : (
            // Hiển thị thông báo đăng nhập khi chưa đăng nhập
            <div className="login-required">
              <p>Vui lòng đăng nhập để đặt bàn</p>
              <button className="login-btn" onClick={handleLoginClick}>
                Đăng nhập ngay
              </button>
            </div>
          )}
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

export default Contact;