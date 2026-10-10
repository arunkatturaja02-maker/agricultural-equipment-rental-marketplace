import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import HouseCard from '../components/HouseCard';
import InquiryModal from '../components/InquiryModal';
import SiteVisitModal from '../components/SiteVisitModal';
import DetailModal from '../components/DetailModal';
import { RefreshCw } from 'lucide-react';

const PROPERTY_TYPES = ['Independent House', 'Villa', 'Farmhouse'];

const Houses = () => {
  const [searchParams] = useSearchParams();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Modals
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchHouses();
  }, [location, propertyType, bedrooms, maxPrice]);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) params.location = location;
      if (propertyType) params.propertyType = propertyType;
      if (bedrooms) params.bedrooms = bedrooms;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/houses', { params });
      setHouses(res.data);
    } catch (err) {
      console.error('Failed to fetch house listings', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setLocation('');
    setPropertyType('');
    setBedrooms('');
    setMaxPrice('');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="section-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">Houses & Villas for Sale</h1>
        <p style={{ color: '#6b7280' }}>
          Explore residential houses, countryside villas & agricultural farmhouses.
        </p>
      </div>

      {toast && <div className="alert-success" style={{ marginBottom: '1.5rem' }}>{toast}</div>}

      {/* Filter Bar */}
      <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Location / Area</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Zirakpur, Kharar"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Property Type</label>
            <select
              className="input-control"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Min Bedrooms</label>
            <input
              type="number"
              className="input-control"
              placeholder="e.g. 2"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Max Price (₹)</label>
            <input
              type="number"
              className="input-control"
              placeholder="e.g. 8000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <button className="btn-secondary" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* House Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading house listings...</div>
      ) : houses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px' }}>
          <h3>No house listings match your current filters.</h3>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Try expanding your price range or location filter.</p>
        </div>
      ) : (
        <div className="grid-layout">
          {houses.map((h) => (
            <HouseCard
              key={h.id}
              house={h}
              onInquire={(house) => setSelectedInquiry(house)}
              onVisit={(house) => setSelectedVisit(house)}
              onViewDetails={(house) => setSelectedDetail(house)}
            />
          ))}
        </div>
      )}

      {selectedInquiry && (
        <InquiryModal
          item={selectedInquiry}
          listingType="HOUSE"
          onClose={() => setSelectedInquiry(null)}
          onSuccess={() => showToast('Inquiry submitted to seller!')}
        />
      )}

      {selectedVisit && (
        <SiteVisitModal
          item={selectedVisit}
          listingType="HOUSE"
          onClose={() => setSelectedVisit(null)}
          onSuccess={() => showToast('Site visit requested successfully!')}
        />
      )}

      {selectedDetail && (
        <DetailModal
          item={selectedDetail}
          type="house"
          onClose={() => setSelectedDetail(null)}
          onAction={(house) => setSelectedInquiry(house)}
        />
      )}
    </div>
  );
};

export default Houses;
