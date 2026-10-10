import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import LandCard from '../components/LandCard';
import InquiryModal from '../components/InquiryModal';
import SiteVisitModal from '../components/SiteVisitModal';
import DetailModal from '../components/DetailModal';
import { RefreshCw } from 'lucide-react';

const Lands = () => {
  const [searchParams] = useSearchParams();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');

  // Modals
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchLands();
  }, [district, location, minPrice, maxPrice, minArea]);

  const fetchLands = async () => {
    setLoading(true);
    try {
      const params = {};
      if (district) params.district = district;
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minArea) params.minArea = minArea;

      const res = await api.get('/lands', { params });
      setLands(res.data);
    } catch (err) {
      console.error('Failed to fetch land listings', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setDistrict('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="section-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Agricultural Farmland Sales</h1>
        <p style={{ color: '#6b7280' }}>
          Discover fertile agricultural lands, plot subdivisions & farming estates.
        </p>
      </div>

      {toast && <div className="alert-success" style={{ marginBottom: '1.5rem' }}>{toast}</div>}

      {/* Filter Bar */}
      <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>District</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Mohali, Patiala"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Location / Village</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Kurali"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Min Area (Acres)</label>
            <input
              type="number"
              className="input-control"
              placeholder="e.g. 2"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Max Budget (₹)</label>
            <input
              type="number"
              className="input-control"
              placeholder="e.g. 10000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <button className="btn-secondary" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Land Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading agricultural land listings...</div>
      ) : lands.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px' }}>
          <h3>No farmland listings match your search criteria.</h3>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Try clearing filters or checking back later.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {lands.map((l) => (
            <LandCard
              key={l.id}
              land={l}
              onInquire={(land) => setSelectedInquiry(land)}
              onVisit={(land) => setSelectedVisit(land)}
              onViewDetails={(land) => setSelectedDetail(land)}
            />
          ))}
        </div>
      )}

      {selectedInquiry && (
        <InquiryModal
          item={selectedInquiry}
          listingType="LAND"
          onClose={() => setSelectedInquiry(null)}
          onSuccess={() => showToast('Inquiry submitted to land owner!')}
        />
      )}

      {selectedVisit && (
        <SiteVisitModal
          item={selectedVisit}
          listingType="LAND"
          onClose={() => setSelectedVisit(null)}
          onSuccess={() => showToast('Site visit requested successfully!')}
        />
      )}

      {selectedDetail && (
        <DetailModal
          item={selectedDetail}
          type="land"
          onClose={() => setSelectedDetail(null)}
          onAction={(land) => setSelectedInquiry(land)}
        />
      )}
    </div>
  );
};

export default Lands;
