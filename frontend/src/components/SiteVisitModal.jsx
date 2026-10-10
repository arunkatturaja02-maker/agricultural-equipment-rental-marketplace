import React, { useState } from 'react';
import api from '../services/api';

const SiteVisitModal = ({ item, listingType, onClose, onSuccess }) => {
  const [requestedDatetime, setRequestedDatetime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/site-visits', {
        listingType,
        listingId: item.id,
        requestedDatetime,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request site visit.');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '0.5rem', color: '#1b4332' }}>Schedule Site Visit</h2>
        <p style={{ fontWeight: 600, color: '#374151', marginBottom: '1.5rem' }}>
          Property: {item.title} ({item.location})
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Preferred Visit Date & Time</label>
            <input
              type="datetime-local"
              className="input-control"
              value={requestedDatetime}
              onChange={(e) => setRequestedDatetime(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-accent" disabled={loading} style={{ flex: 1.5 }}>
              {loading ? 'Requesting...' : 'Request Site Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteVisitModal;
