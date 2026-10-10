import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import VehicleCard from '../components/VehicleCard';
import LandCard from '../components/LandCard';
import HouseCard from '../components/HouseCard';
import BookingModal from '../components/BookingModal';
import InquiryModal from '../components/InquiryModal';
import SiteVisitModal from '../components/SiteVisitModal';
import DetailModal from '../components/DetailModal';
import { Tractor, MapPin, Search, ArrowRight, ShieldCheck, Award, ThumbsUp } from 'lucide-react';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [lands, setLands] = useState([]);
  const [houses, setHouses] = useState([]);
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [searchLocation, setSearchLocation] = useState('');

  // Modal states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedInquiryItem, setSelectedInquiryItem] = useState(null);
  const [inquiryType, setInquiryType] = useState('LAND');
  const [selectedVisitItem, setSelectedVisitItem] = useState(null);
  const [visitType, setVisitType] = useState('LAND');
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [detailType, setDetailType] = useState('');

  const [notification, setNotification] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, lRes, hRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/lands'),
        api.get('/houses'),
      ]);
      setVehicles(vRes.data);
      setLands(lRes.data);
      setHouses(hRes.data);
    } catch (err) {
      console.error('Error fetching home data:', err);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchCategory === 'VEHICLES') {
      navigate(`/vehicles?location=${encodeURIComponent(searchLocation)}`);
    } else if (searchCategory === 'LANDS') {
      navigate(`/lands?location=${encodeURIComponent(searchLocation)}`);
    } else if (searchCategory === 'HOUSES') {
      navigate(`/houses?location=${encodeURIComponent(searchLocation)}`);
    } else {
      navigate(`/vehicles?location=${encodeURIComponent(searchLocation)}`);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Your Land, Your Home, Your Farming Partner</h1>
        <p className="hero-subtitle">
          Rent agricultural vehicles, discover farmland, and find your dream home in one place.
        </p>

        <form onSubmit={handleHeroSearch} className="hero-search-box">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="VEHICLES">Agricultural Vehicles</option>
            <option value="LANDS">Farmland & Plot Sales</option>
            <option value="HOUSES">Houses & Villas</option>
          </select>

          <input
            type="text"
            placeholder="Search by District, Village or City (e.g. Mohali, Ludhiana)..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />

          <button type="submit" className="btn-primary" style={{ flex: '0 0 auto', width: 'auto' }}>
            <Search size={18} /> Search
          </button>
        </form>

        <div className="hero-action-btns">
          <button className="btn-accent" onClick={() => navigate('/vehicles')}>
            Explore Vehicles
          </button>
          <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} onClick={() => navigate('/lands')}>
            Find Farmland
          </button>
          <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} onClick={() => navigate('/houses')}>
            Browse Houses
          </button>
        </div>
      </section>

      {/* Notification toast */}
      {notification && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1100 }} className="alert-success">
          {notification}
        </div>
      )}

      {/* Featured Vehicles */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Rent Agricultural Vehicles</h2>
            <p style={{ color: '#6b7280' }}>Heavy tractors, harvesters & JCB machinery available per hour/day</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/vehicles')}>
            View All Vehicles <ArrowRight size={16} inline />
          </button>
        </div>

        <div className="grid-layout">
          {vehicles.slice(0, 3).map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onBook={(veh) => setSelectedVehicle(veh)}
              onViewDetails={(veh) => { setSelectedDetailItem(veh); setDetailType('vehicle'); }}
            />
          ))}
        </div>
      </section>

      {/* Featured Lands */}
      <section className="section-container" style={{ background: '#f3f9f4', padding: '3rem 1.5rem', borderRadius: '16px' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Agricultural Lands for Sale</h2>
            <p style={{ color: '#6b7280' }}>Fertile farmland plots with borewells, water sources & road access</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/lands')}>
            View All Farmlands <ArrowRight size={16} inline />
          </button>
        </div>

        <div className="grid-layout">
          {lands.slice(0, 3).map((l) => (
            <LandCard
              key={l.id}
              land={l}
              onInquire={(land) => { setSelectedInquiryItem(land); setInquiryType('LAND'); }}
              onVisit={(land) => { setSelectedVisitItem(land); setVisitType('LAND'); }}
              onViewDetails={(land) => { setSelectedDetailItem(land); setDetailType('land'); }}
            />
          ))}
        </div>
      </section>

      {/* Featured Houses */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Houses & Villas for Sale</h2>
            <p style={{ color: '#6b7280' }}>Modern independent homes & farmhouses in peaceful surroundings</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/houses')}>
            View All Houses <ArrowRight size={16} inline />
          </button>
        </div>

        <div className="grid-layout">
          {houses.slice(0, 3).map((h) => (
            <HouseCard
              key={h.id}
              house={h}
              onInquire={(house) => { setSelectedInquiryItem(house); setInquiryType('HOUSE'); }}
              onVisit={(house) => { setSelectedVisitItem(house); setVisitType('HOUSE'); }}
              onViewDetails={(house) => { setSelectedDetailItem(house); setDetailType('house'); }}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onSuccess={() => showToast('Rental booking request submitted successfully!')}
        />
      )}

      {selectedInquiryItem && (
        <InquiryModal
          item={selectedInquiryItem}
          listingType={inquiryType}
          onClose={() => setSelectedInquiryItem(null)}
          onSuccess={() => showToast('Inquiry sent to seller successfully!')}
        />
      )}

      {selectedVisitItem && (
        <SiteVisitModal
          item={selectedVisitItem}
          listingType={visitType}
          onClose={() => setSelectedVisitItem(null)}
          onSuccess={() => showToast('Site visit requested successfully!')}
        />
      )}

      {selectedDetailItem && (
        <DetailModal
          item={selectedDetailItem}
          type={detailType}
          onClose={() => setSelectedDetailItem(null)}
          onAction={(item) => {
            if (detailType === 'vehicle') setSelectedVehicle(item);
            else { setSelectedInquiryItem(item); setInquiryType(detailType.toUpperCase()); }
          }}
        />
      )}
    </div>
  );
};

export default Home;
