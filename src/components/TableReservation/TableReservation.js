import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './TableReservation.css';

const TableReservation = ({ isOpen, onClose }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Danh sách các bàn trong nhà hàng
  const tables = [
    { id: 1, name: 'Bàn 01', seats: 2, status: 'available', position: 'Cửa sổ' },
    { id: 2, name: 'Bàn 02', seats: 2, status: 'reserved', position: 'Cửa sổ' },
    { id: 3, name: 'Bàn 03', seats: 4, status: 'available', position: 'Trong nhà' },
    { id: 4, name: 'Bàn 04', seats: 4, status: 'available', position: 'Trong nhà' },
    { id: 5, name: 'Bàn 05', seats: 6, status: 'occupied', position: 'Ngoài trời' },
    { id: 6, name: 'Bàn 06', seats: 6, status: 'available', position: 'Ngoài trời' },
    { id: 7, name: 'Bàn 07', seats: 8, status: 'available', position: 'VIP' },
    { id: 8, name: 'Bàn 08', seats: 2, status: 'available', position: 'Cửa sổ' },
    { id: 9, name: 'Bàn 09', seats: 4, status: 'reserved', position: 'Trong nhà' },
    { id: 10, name: 'Bàn 10', seats: 8, status: 'available', position: 'VIP' },
  ];
  
  // Lọc bàn theo số chỗ ngồi
  const [seatFilter, setSeatFilter] = useState('all');
  
  // Lọc bàn theo vị trí
  const [positionFilter, setPositionFilter] = useState('all');
  
  // Tạo URL đặt bàn dựa trên thông tin bàn
  const getReservationUrl = (table) => {
    // Trong thực tế, bạn có thể tạo URL tới hệ thống đặt bàn của bạn
    return `https://restaurant.com/reserve?table=${table.id}&seats=${table.seats}`;
  };
  
  // Lọc bàn dựa trên các bộ lọc đã chọn
  const filteredTables = tables.filter(table => {
    // Lọc theo số chỗ ngồi
    if (seatFilter !== 'all' && table.seats !== parseInt(seatFilter)) {
      return false;
    }
    
    // Lọc theo vị trí
    if (positionFilter !== 'all' && table.position !== positionFilter) {
      return false;
    }
    
    return true;
  });
  
  const getStatusText = (status) => {
    switch(status) {
      case 'available': return 'Trống';
      case 'reserved': return 'Đã đặt';
      case 'occupied': return 'Đã có khách';
      default: return status;
    }
  };
  
  // Xử lý click vào bàn
  const handleTableClick = (table) => {
    if (selectedTable && selectedTable.id === table.id) {
      setSelectedTable(null); // Đóng QR nếu click vào bàn đang được chọn
    } else {
      setSelectedTable(table); // Hiển thị QR cho bàn được click
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
              <option value="4">4 người</option>
              <option value="6">6 người</option>
              <option value="8">8 người</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Vị trí:</label>
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Cửa sổ">Cửa sổ</option>
              <option value="Trong nhà">Trong nhà</option>
              <option value="Ngoài trời">Ngoài trời</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>
        
        <div className="table-map">
          {filteredTables.map(table => (
            <div 
              key={table.id}
              className={`table-item ${table.status} ${selectedTable && selectedTable.id === table.id ? 'selected' : ''}`}
              onClick={() => handleTableClick(table)}
            >
              <div className="table-info">
                <h3>{table.name}</h3>
                <p>{table.seats} người</p>
                <p className="table-status">{getStatusText(table.status)}</p>
                <p className="table-position">{table.position}</p>
              </div>
              
              {/* Hiển thị QR code khi hover hoặc click */}
              <div className="table-qr">
                <div className="qr-content">
                  <QRCodeSVG
                    value={getReservationUrl(table)}
                    size={150}
                    level={"H"}
                    includeMargin={true}
                    imageSettings={{
                      src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Forms_logo.svg",
                      x: undefined,
                      y: undefined,
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                  <p>Quét mã để đặt bàn</p>
                  <p className="table-info-qr">
                    Bàn {table.name} - {table.seats} người<br />
                    Trạng thái: {getStatusText(table.status)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="table-legend">
          <div className="legend-item">
            <span className="status-dot available"></span> Trống
          </div>
          <div className="legend-item">
            <span className="status-dot reserved"></span> Đã đặt
          </div>
          <div className="legend-item">
            <span className="status-dot occupied"></span> Đã có khách
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
              <button className="reserve-btn">Đặt bàn ngay</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableReservation;