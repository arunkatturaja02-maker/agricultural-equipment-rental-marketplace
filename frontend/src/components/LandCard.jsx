import React, { useState } from 'react';
import { MapPin, Droplets, Zap, Navigation } from 'lucide-react';

const DEFAULT_LAND_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

const LandCard = ({ land, onInquire, onVisit, onViewDetails }) => {
  const [imgSrc, setImgSrc] = useState(land.imageUrls?.[0] || DEFAULT_LAND_IMAGE);

  return (
    <div className="item-card">
      <div className="card-img-wrapper">
        <img
          src={imgSrc}
          alt={land.title}
          className="card-img"
          onError={() => setImgSrc(DEFAULT_LAND_IMAGE)}
        />
        <span className="card-badge" style={{ background: '#2d6a4f' }}>{land.areaAcres} Acres</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{land.title}</h3>
        <p className="card-location">
          <MapPin size={14} />
          {land.location}, {land.district}
        </p>

        <div className="card-details">
          <span className="card-detail-item">Soil: {land.soilType || 'N/A'}</span>
          <span className="card-detail-item"><Droplets size={12} inline /> {land.waterAvailability || 'Water Available'}</span>
        </div>

        <div className="card-price">
          ₹{Number(land.price).toLocaleString('en-IN')}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onViewDetails(land)}>
            Details
          </button>
          <button className="btn-accent" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onVisit(land)}>
            Site Visit
          </button>
          <button className="btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onInquire(land)}>
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;
