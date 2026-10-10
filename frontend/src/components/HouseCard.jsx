import React, { useState } from 'react';
import { MapPin, Bed, Bath, Maximize2, Car } from 'lucide-react';

const DEFAULT_HOUSE_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

const HouseCard = ({ house, onInquire, onVisit, onViewDetails }) => {
  const [imgSrc, setImgSrc] = useState(house.imageUrls?.[0] || DEFAULT_HOUSE_IMAGE);

  return (
    <div className="item-card">
      <div className="card-img-wrapper">
        <img
          src={imgSrc}
          alt={house.title}
          className="card-img"
          onError={() => setImgSrc(DEFAULT_HOUSE_IMAGE)}
        />
        <span className="card-badge" style={{ background: '#d4a373' }}>{house.propertyType}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{house.title}</h3>
        <p className="card-location">
          <MapPin size={14} />
          {house.location}
        </p>

        <div className="card-details">
          <span className="card-detail-item"><Bed size={12} inline /> {house.bedrooms} BHK</span>
          <span className="card-detail-item"><Bath size={12} inline /> {house.bathrooms} Baths</span>
          <span className="card-detail-item"><Maximize2 size={12} inline /> {house.builtUpArea} sq.ft</span>
        </div>

        <div className="card-price">
          ₹{Number(house.price).toLocaleString('en-IN')}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onViewDetails(house)}>
            Details
          </button>
          <button className="btn-accent" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onVisit(house)}>
            Site Visit
          </button>
          <button className="btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onInquire(house)}>
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
