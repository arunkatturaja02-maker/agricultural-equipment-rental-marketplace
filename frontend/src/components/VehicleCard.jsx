import React, { useState } from 'react';
import { MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';

const VehicleCard = ({ vehicle, onBook, onViewDetails }) => {
  const [imgSrc, setImgSrc] = useState(vehicle.imageUrls?.[0] || DEFAULT_IMAGE);

  return (
    <div className="item-card">
      <div className="card-img-wrapper">
        <img
          src={imgSrc}
          alt={vehicle.name}
          className="card-img"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />
        <span className="card-badge">{vehicle.category}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{vehicle.name}</h3>
        <p className="card-location">
          <MapPin size={14} />
          {vehicle.location}
        </p>

        <div className="card-details">
          <span className="card-detail-item">Brand: {vehicle.brand || 'N/A'}</span>
          <span className="card-detail-item">Model: {vehicle.model || 'N/A'}</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {vehicle.description}
        </p>

        <div className="card-price">
          ₹{vehicle.dailyRate} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#6b7280' }}>/ day</span>
          <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#2d6a4f' }}>(₹{vehicle.hourlyRate}/hr)</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => onViewDetails(vehicle)}>
            Details
          </button>
          <button className="btn-primary" style={{ flex: 1.2 }} onClick={() => onBook(vehicle)}>
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
