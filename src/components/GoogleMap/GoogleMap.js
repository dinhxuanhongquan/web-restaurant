import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './GoogleMap.css';

const MapComponent = () => {
  const [selectedMarker, setSelectedMarker] = React.useState(false);

  const mapStyles = {
    height: "400px",
    width: "100%"
  };
  
  // Restaurant location - Tân Bình, HCM coordinates (replace with your actual coordinates)
  const defaultCenter = {
    lat: 10.8009,  // Tân Bình approximate coordinates
    lng: 106.6582
  };

  const locations = [
    {
      name: "La Delizioso",
      location: { 
        lat: 10.8009,
        lng: 106.6582
      },
      address: "17A Cộng Hòa, Tân Bình, TP.Hồ Chí Minh"
    }
  ];

  const onMarkerClick = () => {
    setSelectedMarker(true);
  };

  const onInfoWindowClose = () => {
    setSelectedMarker(false);
  };

  return (
    <section id="location" className="map-section">
      <div className="container">
        <div className="section-title">
          <h2>location</h2>
          <p>Visit our restaurant for an unforgettable dining experience</p>
        </div>

        <div className="map-container">
          <div>
          <LoadScript googleMapsApiKey="AIzaSyB7I7OWlucMn64vjtjpu1GbJOFdFm2RLwk">
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={15}
              center={defaultCenter}
            >
              {locations.map(item => {
                return (
                  <Marker 
                    key={item.name}
                    position={item.location}
                    onClick={onMarkerClick}
                  >
                    {selectedMarker && (
                      <InfoWindow
                        position={item.location}
                        onCloseClick={onInfoWindowClose}
                      >
                        <div className="info-window">
                          <h3>{item.name}</h3>
                          <p>{item.address}</p>
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Get Directions
                          </a>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </GoogleMap>
          </LoadScript>
          </div>

          <div className="location-info">
            <div className="info-card">
              <h3>Visit Our Restaurant</h3>
              <div className="info-item">
                <strong>Address:</strong>
                <p>17A Cộng Hòa, Tân Bình, TP.Hồ Chí Minh</p>
              </div>
              <div className="info-item">
                <strong>Hours:</strong>
                <p>Monday - Friday: 12:00 PM - 10:00 PM</p>
                <p>Saturday - Sunday: 11:00 AM - 11:00 PM</p>
              </div>
              <div className="info-item">
                <strong>Contact:</strong>
                <p>Phone: (+84) 0963 689 773</p>
                <p>Email: quandinh.09022003@gmail.com</p>
              </div>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=10.8009,106.6582" 
                className="direction-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapComponent;