import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import './TableReservation.css';

const TableReservation = ({ isOpen, onClose, user }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [seatFilter, setSeatFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  
  // Fetch tables from API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/restaurant/tables');
        
        if (response.data?.result) {
          // Map API data to our component's format
          const mappedTables = response.data.result.map(table => ({
            id: table.tableId,
            name: table.tableName,
            seats: table.tableSeat,
            status: table.tableStatus.toLowerCase(), // Convert to lowercase
            position: mapLocation(table.tableLocation), // Map location to display name
            kind: table.tableKind
          }));
          
          setTables(mappedTables);
        } else {
          setError("Failed to load tables data");
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError("Error loading tables. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchTables();
    }
  }, [isOpen]);
  
  // Helper function to map API location values to display names
  const mapLocation = (location) => {
    const locationMap = {
      'inside': 'Trong nhà',
      'outside': 'Ngoài trời'
    };
    
    return locationMap[location] || location;
  };
  
  // Get reservation URL
  const getReservationUrl = (table) => {
    // In a real application, this would be a URL to your reservation system
    // return `http://localhost:3000/reserve?tableId=${table.id}&seats=${table.seats}`;
    return `https://www.facebook.com/hong.quann.660872/`;
  };
  
  // Filter tables based on selected filters
  const filteredTables = tables.filter(table => {
    // Filter by seats
    if (seatFilter !== 'all' && table.seats !== parseInt(seatFilter)) {
      return false;
    }
    
    // Filter by position
    if (positionFilter !== 'all' && table.position !== positionFilter) {
      return false;
    }
    
    return true;
  });
  
  // Get status text in Vietnamese
  const getStatusText = (status) => {
    switch(status) {
      case 'available': return 'Trống';
      case 'booked': return 'Đã đặt';
      case 'unavailable': return 'Không khả dụng';
      default: return status;
    }
  };
  
  // Handle table click
  const handleTableClick = (table) => {
    if (table.status === 'booked' || table.status === 'unavailable') {
      return;
    }
    // Toggle selection

    if (selectedTable && selectedTable.id === table.id) {
      setSelectedTable(null);
    } else {
      setSelectedTable(table);
    }
  };

  const handleQrCodeClick = (table, e) => {
    e.stopPropagation(); // Prevent the table click event
    e.preventDefault(); // Prevent default action

    onClose(); // Close the modal after redirecting

    setTimeout(() => {
      window.location.href = `/contact?tableId=${table.id}`;
    }, 100);
  };

  // Handle table reservation
  const handleReserveTable = async (tableId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt bàn");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      // Here you would implement the API call to reserve the table
      const response = await axios.post(
        `http://localhost:8000/restaurant/bookings`, 
        {
          tableId: tableId,
          // You might want to add a date/time selector to your UI
          bookingTime: new Date().toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.result) {
        alert("Bàn đã được đặt thành công!");
        // Refresh the tables list
        const tablesResponse = await axios.get('http://localhost:8000/restaurant/tables');
        if (tablesResponse.data?.result) {
          const mappedTables = tablesResponse.data.result.map(table => ({
            id: table.tableId,
            name: table.tableName,
            seats: table.tableSeat,
            status: table.tableStatus.toLowerCase(),
            position: mapLocation(table.tableLocation),
            kind: table.tableKind
          }));
          
          setTables(mappedTables);
        }
      }
    } catch (error) {
      console.error("Error reserving table:", error);
      alert("Không thể đặt bàn. Vui lòng thử lại sau.");
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="table-overlay" onClick={onClose}>
      <div className="table-container" onClick={e => e.stopPropagation()}>
        <div className="table-header">
          <h2>Chọn Bàn</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="filter-section">  
          <div className="filter-group">
            <label>Số chỗ ngồi:</label>
            <select value={seatFilter} onChange={(e) => setSeatFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="2">2 người</option>
              <option value="3">3 người</option>
              <option value="4">4 người</option>
              <option value="5">5 người</option>
              <option value="6">6 người</option>
              <option value="7">7 người</option>
              <option value="8">8 người</option>
              <option value="9">9 người</option>
              <option value="10">10 người</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Vị trí:</label>
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Trong nhà">Trong nhà</option>
              <option value="Ngoài trời">Ngoài trời</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-indicator">Đang tải dữ liệu bàn...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="table-map">
            {filteredTables.map(table => (
              <div 
                key={table.id}
                className={`table-item ${table.status} ${selectedTable && selectedTable.id === table.id ? 'selected' : ''} ${table.status === 'booked' ? 'not-clickable' : ''}`}
                onClick={() => handleTableClick(table)}
              >
                <div className="table-info">
                  <h3>{table.name}</h3>
                  <p>{table.seats} người</p>
                  <p className="table-status">{getStatusText(table.status)}</p>
                  <p className="table-position">{table.position}</p>
                </div>
                
                <div className="table-qr">
                  <div className="qr-content" onClick={(e) => handleQrCodeClick(table, e)}>
                    <span className="qr-icon">📱</span>
                    <QRCodeSVG
                      value={getReservationUrl(table)}
                      size={100}
                      level={"H"}
                      includeMargin={true}
                    />
                    <p>Quét mã để đặt bàn</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="table-legend">
          <div className="legend-item">
            <span className="status-dot available"></span> Trống
          </div>
          <div className="legend-item">
            <span className="status-dot booked"></span> Đã đặt
          </div>
          <div className="legend-item">
            <span className="status-dot unavailable"></span> Không khả dụng
          </div>
        </div>
        
        {selectedTable && (
          <div className="selected-table-info">
            <h3>Thông tin bàn đã chọn</h3>
            <p><strong>Bàn:</strong> {selectedTable.name}</p>
            <p><strong>Số chỗ:</strong> {selectedTable.seats} người</p>
            <p><strong>Vị trí:</strong> {selectedTable.position}</p>
            <p><strong>Trạng thái:</strong> {getStatusText(selectedTable.status)}</p>
            {selectedTable.status === 'available' && (
              <button 
                className="reserve-btn"
                onClick={() => handleReserveTable(selectedTable.id)}
              >
                Đặt bàn ngay
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableReservation;