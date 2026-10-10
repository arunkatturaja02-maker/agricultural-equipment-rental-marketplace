import React, { useState } from 'react';
import api from '../services/api';

const InquiryModal = ({ item, listingType, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/inquiries', {
        listingType,
        listingId: item.id,
        message,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry.');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '0.5rem', color: '#1b4332' }}>Send Inquiry to Seller</h2>
        <p style={{ fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>
          Listing: {item.title || item.name}
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Message / Query</label>
            <textarea
              className="input-control"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I am interested in this property/vehicle. Please contact me with more details..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1.5 }}>
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
