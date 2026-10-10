import React from 'react';
import { MapPin, Phone, Mail, User, ShieldCheck } from 'lucide-react';

const DetailModal = ({ item, type, onClose, onAction }) => {
  if (!item) return null;

  const images = item.imageUrls?.length > 0 ? item.imageUrls : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 style={{ color: '#1b4332', marginBottom: '0.5rem' }}>{item.title || item.name}</h2>
        <p className="card-location" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
          <MapPin size={18} color="#2d6a4f" />
          {item.location} {item.district ? `, ${item.district}` : ''}
        </p>

        {/* Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {images.map((img, idx) => (
            <img key={idx} src={img} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
          ))}
        </div>

        {/* Dynamic Key Specs */}
        <div style={{ background: '#f8fdf9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #d1fae5', marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1b4332', marginBottom: '0.75rem' }}>Key Specifications & Pricing</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {type === 'vehicle' && (
              <>
                <div><strong>Hourly Rate:</strong> ₹{item.hourlyRate}/hr</div>
                <div><strong>Daily Rate:</strong> ₹{item.dailyRate}/day</div>
                <div><strong>Brand:</strong> {item.brand || 'N/A'}</div>
                <div><strong>Model:</strong> {item.model || 'N/A'}</div>
              </>
            )}

            {type === 'land' && (
              <>
                <div><strong>Total Price:</strong> ₹{Number(item.price).toLocaleString('en-IN')}</div>
                <div><strong>Land Area:</strong> {item.areaAcres} Acres</div>
                <div><strong>Soil Type:</strong> {item.soilType || 'N/A'}</div>
                <div><strong>Water Source:</strong> {item.waterAvailability || 'N/A'}</div>
                <div><strong>Electricity:</strong> {item.electricityAvailability || 'N/A'}</div>
                <div><strong>Road Access:</strong> {item.roadAccess || 'N/A'}</div>
              </>
            )}

            {type === 'house' && (
              <>
                <div><strong>Price:</strong> ₹{Number(item.price).toLocaleString('en-IN')}</div>
                <div><strong>Bedrooms:</strong> {item.bedrooms} BHK</div>
                <div><strong>Bathrooms:</strong> {item.bathrooms}</div>
                <div><strong>Built-up Area:</strong> {item.builtUpArea} sq.ft</div>
                <div><strong>Property Type:</strong> {item.propertyType}</div>
                <div><strong>Parking:</strong> {item.parkingAvailable ? 'Yes Available' : 'No'}</div>
              </>
            )}
          </div>
        </div>

        <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Description</h4>
        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {item.description || 'No detailed description provided.'}
        </p>

        {/* Seller Info */}
        {(item.owner || item.seller) && (
          <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#111827', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Listed by Owner / Seller
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              Name: {(item.owner || item.seller).fullName}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              Phone: {(item.owner || item.seller).phone}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {onAction && (
            <button className="btn-primary" style={{ width: 'auto' }} onClick={() => { onClose(); onAction(item); }}>
              Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
