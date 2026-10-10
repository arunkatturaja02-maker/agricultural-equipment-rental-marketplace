import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import VehicleCard from '../components/VehicleCard';
import BookingModal from '../components/BookingModal';
import DetailModal from '../components/DetailModal';
import { Search, Filter, RefreshCw } from 'lucide-react';

const CATEGORIES = ['Tractor', 'JCB', 'Harvester', 'Rotavator', 'Cultivator', 'Plough', 'Seed Drill', 'Other'];

const Vehicles = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState('');
  const [maxRate, setMaxRate] = useState('');

  // Modals
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [category, location, search, maxRate]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (location) params.location = location;
      if (search) params.search = search;
      if (maxRate) params.maxDailyRate = maxRate;

      const res = await api.get('/vehicles', { params });
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setCategory('');
    setMaxRate('');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="section-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Agriculture Vehicle & Equipment Rentals</h1>
        <p style={{ color: '#6b7280' }}>
          Rent heavy machinery from verified local owners across India.
        </p>
      </div>

      {toast && <div className="alert-success" style={{ marginBottom: '1.5rem' }}>{toast}</div>}

      {/* Filter Bar */}
      <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Search Name / Model</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Mahindra, Swaraj..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Location / District</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Mohali"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select
              className="input-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Max Daily Rate (₹)</label>
            <input
              type="number"
              className="input-control"
              placeholder="e.g. 5000"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
            />
          </div>

          <button className="btn-secondary" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading available vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px' }}>
          <h3>No agricultural vehicles match your current filter.</h3>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Try clearing your search filters to view available equipment.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onBook={(veh) => setSelectedVehicle(veh)}
              onViewDetails={(veh) => setSelectedDetail(veh)}
            />
          ))}
        </div>
      )}

      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onSuccess={() => showToast('Rental booking request submitted successfully!')}
        />
      )}

      {selectedDetail && (
        <DetailModal
          item={selectedDetail}
          type="vehicle"
          onClose={() => setSelectedDetail(null)}
          onAction={(v) => setSelectedVehicle(v)}
        />
      )}
    </div>
  );
};

export default Vehicles;
