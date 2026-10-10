import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BookingModal = ({ vehicle, onClose, onSuccess }) => {
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (startDatetime && endDatetime && vehicle) {
      const start = new Date(startDatetime);
      const end = new Date(endDatetime);
      if (end > start) {
        const diffMs = end - start;
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffHours / 24);
        const remHours = diffHours % 24;

        let total = 0;
        if (days > 0) {
          total = days * vehicle.dailyRate + remHours * vehicle.hourlyRate;
        } else {
          total = diffHours * vehicle.hourlyRate;
        }
        setEstimatedCost(total);
        setError('');
      } else {
        setEstimatedCost(0);
      }
    }
  }, [startDatetime, endDatetime, vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/bookings', {
        vehicleId: vehicle.id,
        startDatetime,
        endDatetime,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '1rem', color: '#1b4332' }}>Book Vehicle Rental</h2>
        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{vehicle.name}</p>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Rate: ₹{vehicle.dailyRate}/day | ₹{vehicle.hourlyRate}/hour
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rental Start Date & Time</label>
            <input
              type="datetime-local"
              className="input-control"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Rental End Date & Time</label>
            <input
              type="datetime-local"
              className="input-control"
              value={endDatetime}
              onChange={(e) => setEndDatetime(e.target.value)}
              required
            />
          </div>

          {estimatedCost > 0 && (
            <div style={{ background: '#f8fdf9', padding: '1rem', borderRadius: '8px', border: '1px solid #52b788', margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: '#1b4332' }}>
                <span>Estimated Rental Cost:</span>
                <span>₹{estimatedCost.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                Calculated based on duration and rental rates.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1.5 }}>
              {loading ? 'Submitting Request...' : 'Confirm Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
