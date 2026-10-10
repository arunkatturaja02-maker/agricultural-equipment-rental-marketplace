import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, Edit, CheckCircle, XCircle, Calendar, MessageSquare, Tractor, MapPin, Home } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('vehicles');

  const [vehicles, setVehicles] = useState([]);
  const [lands, setLands] = useState([]);
  const [houses, setHouses] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Add Listing Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('vehicle'); // vehicle, land, house
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const [vRes, lRes, hRes, bRes, iRes, svRes] = await Promise.all([
        api.get('/vehicles/my'),
        api.get('/lands/my'),
        api.get('/houses/my'),
        api.get('/bookings/owner'),
        api.get('/inquiries/received'),
        api.get('/site-visits/received'),
      ]);
      setVehicles(vRes.data);
      setLands(lRes.data);
      setHouses(hRes.data);
      setBookingRequests(bRes.data);
      setInquiries(iRes.data);
      setSiteVisits(svRes.data);
    } catch (err) {
      console.error('Error fetching seller dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRejectBooking = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status?status=${status}`);
      setToast(`Booking status updated to ${status}.`);
      fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleUpdateVisitStatus = async (id, status) => {
    try {
      await api.patch(`/site-visits/${id}/status?status=${status}`);
      setToast(`Visit status updated to ${status}.`);
      fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDeleteListing = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} listing?`)) return;
    try {
      await api.delete(`/${type}s/${id}`);
      setToast('Listing deleted successfully.');
      fetchSellerData();
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'vehicle') {
        const payload = {
          name: formData.name,
          category: formData.category || 'Tractor',
          brand: formData.brand,
          model: formData.model,
          description: formData.description,
          hourlyRate: Number(formData.hourlyRate),
          dailyRate: Number(formData.dailyRate),
          location: formData.location,
          imageUrls: formData.imageUrls ? formData.imageUrls.split(',').map((s) => s.trim()) : [],
        };
        await api.post('/vehicles', payload);
      } else if (modalType === 'land') {
        const payload = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          district: formData.district,
          areaAcres: Number(formData.areaAcres),
          price: Number(formData.price),
          soilType: formData.soilType,
          waterAvailability: formData.waterAvailability,
          electricityAvailability: formData.electricityAvailability,
          roadAccess: formData.roadAccess,
          imageUrls: formData.imageUrls ? formData.imageUrls.split(',').map((s) => s.trim()) : [],
        };
        await api.post('/lands', payload);
      } else if (modalType === 'house') {
        const payload = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          builtUpArea: Number(formData.builtUpArea),
          plotArea: Number(formData.plotArea || formData.builtUpArea),
          propertyType: formData.propertyType || 'Independent House',
          parkingAvailable: true,
          imageUrls: formData.imageUrls ? formData.imageUrls.split(',').map((s) => s.trim()) : [],
        };
        await api.post('/houses', payload);
      }
      setShowAddModal(false);
      setFormData({});
      setToast('New listing added successfully!');
      fetchSellerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add listing.');
    }
  };

  return (
    <div className="section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Seller & Owner Management Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Manage your vehicles, lands, property listings & customer requests.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-primary" onClick={() => { setModalType('vehicle'); setFormData({}); setShowAddModal(true); }}>
            <Plus size={16} /> Add Vehicle
          </button>
          <button className="btn-accent" onClick={() => { setModalType('land'); setFormData({}); setShowAddModal(true); }}>
            <Plus size={16} /> Add Land
          </button>
          <button className="btn-secondary" style={{ background: '#d4a373', color: 'white' }} onClick={() => { setModalType('house'); setFormData({}); setShowAddModal(true); }}>
            <Plus size={16} /> Add House
          </button>
        </div>
      </div>

      {toast && <div className="alert-success">{toast}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ background: activeTab === 'vehicles' ? '#1b4332' : 'transparent', color: activeTab === 'vehicles' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('vehicles')}>
          <Tractor size={16} inline /> My Vehicles ({vehicles.length})
        </button>
        <button className="btn-secondary" style={{ background: activeTab === 'lands' ? '#1b4332' : 'transparent', color: activeTab === 'lands' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('lands')}>
          <MapPin size={16} inline /> My Lands ({lands.length})
        </button>
        <button className="btn-secondary" style={{ background: activeTab === 'houses' ? '#1b4332' : 'transparent', color: activeTab === 'houses' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('houses')}>
          <Home size={16} inline /> My Houses ({houses.length})
        </button>
        <button className="btn-secondary" style={{ background: activeTab === 'bookings' ? '#1b4332' : 'transparent', color: activeTab === 'bookings' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('bookings')}>
          <Calendar size={16} inline /> Booking Requests ({bookingRequests.length})
        </button>
        <button className="btn-secondary" style={{ background: activeTab === 'inquiries' ? '#1b4332' : 'transparent', color: activeTab === 'inquiries' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('inquiries')}>
          <MessageSquare size={16} inline /> Customer Inquiries ({inquiries.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading seller listings & requests...</div>
      ) : (
        <>
          {/* My Vehicles */}
          {activeTab === 'vehicles' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle Name</th>
                    <th>Category</th>
                    <th>Hourly / Daily Rate</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td>#{v.id}</td>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.category}</td>
                      <td>₹{v.hourlyRate}/hr | ₹{v.dailyRate}/day</td>
                      <td>{v.location}</td>
                      <td><span className={`badge-status status-${v.listingStatus?.toLowerCase()}`}>{v.listingStatus}</span></td>
                      <td>
                        <button onClick={() => handleDeleteListing('vehicle', v.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* My Lands */}
          {activeTab === 'lands' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Land Title</th>
                    <th>District</th>
                    <th>Area (Acres)</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lands.map((l) => (
                    <tr key={l.id}>
                      <td>#{l.id}</td>
                      <td><strong>{l.title}</strong></td>
                      <td>{l.district} ({l.location})</td>
                      <td>{l.areaAcres} Acres</td>
                      <td>₹{Number(l.price).toLocaleString('en-IN')}</td>
                      <td><span className={`badge-status status-${l.listingStatus?.toLowerCase()}`}>{l.listingStatus}</span></td>
                      <td>
                        <button onClick={() => handleDeleteListing('land', l.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* My Houses */}
          {activeTab === 'houses' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>BHK / Area</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {houses.map((h) => (
                    <tr key={h.id}>
                      <td>#{h.id}</td>
                      <td><strong>{h.title}</strong></td>
                      <td>{h.location}</td>
                      <td>{h.bedrooms} BHK ({h.builtUpArea} sq.ft)</td>
                      <td>₹{Number(h.price).toLocaleString('en-IN')}</td>
                      <td><span className={`badge-status status-${h.listingStatus?.toLowerCase()}`}>{h.listingStatus}</span></td>
                      <td>
                        <button onClick={() => handleDeleteListing('house', h.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Booking Requests */}
          {activeTab === 'bookings' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Customer Details</th>
                    <th>Requested Start - End</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td><strong>{b.vehicle?.name}</strong></td>
                      <td>{b.customer?.fullName}<br/><span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Ph: {b.customer?.phone}</span></td>
                      <td>{new Date(b.startDatetime).toLocaleString()}<br/>to {new Date(b.endDatetime).toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: '#1b4332' }}>₹{b.totalAmount}</td>
                      <td><span className={`badge-status status-${b.bookingStatus?.toLowerCase()}`}>{b.bookingStatus}</span></td>
                      <td>
                        {b.bookingStatus === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => handleApproveRejectBooking(b.id, 'APPROVED')} style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                              Approve
                            </button>
                            <button onClick={() => handleApproveRejectBooking(b.id, 'REJECTED')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Decision Final</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customer Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Listing Type & ID</th>
                    <th>Customer Name & Contact</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td>#{inq.id}</td>
                      <td><span className="card-badge" style={{ position: 'static' }}>{inq.listingType}</span> #{inq.listingId}</td>
                      <td><strong>{inq.customer?.fullName}</strong><br/><span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Email: {inq.customer?.email} | Ph: {inq.customer?.phone}</span></td>
                      <td>{inq.message}</td>
                      <td>{new Date(inq.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
            <h2 style={{ color: '#1b4332', marginBottom: '1.5rem' }}>Add New {modalType.toUpperCase()} Listing</h2>

            <form onSubmit={handleFormSubmit}>
              {modalType === 'vehicle' && (
                <>
                  <div className="form-group"><label>Vehicle Name</label><input type="text" className="input-control" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div className="form-group"><label>Category</label><select className="input-control" onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option value="Tractor">Tractor</option><option value="JCB">JCB</option><option value="Harvester">Harvester</option><option value="Rotavator">Rotavator</option><option value="Cultivator">Cultivator</option><option value="Plough">Plough</option><option value="Seed Drill">Seed Drill</option><option value="Other">Other</option></select></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label>Brand</label><input type="text" className="input-control" onChange={(e) => setFormData({ ...formData, brand: e.target.value })} /></div>
                    <div className="form-group"><label>Model</label><input type="text" className="input-control" onChange={(e) => setFormData({ ...formData, model: e.target.value })} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label>Hourly Rate (₹)</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} /></div>
                    <div className="form-group"><label>Daily Rate (₹)</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })} /></div>
                  </div>
                </>
              )}

              {modalType === 'land' && (
                <>
                  <div className="form-group"><label>Land Title</label><input type="text" className="input-control" required onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label>District</label><input type="text" className="input-control" required onChange={(e) => setFormData({ ...formData, district: e.target.value })} /></div>
                    <div className="form-group"><label>Area in Acres</label><input type="number" step="0.1" className="input-control" required onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><label>Price (₹)</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label>Soil Type</label><input type="text" className="input-control" placeholder="Black Soil, Alluvial..." onChange={(e) => setFormData({ ...formData, soilType: e.target.value })} /></div>
                    <div className="form-group"><label>Water Source</label><input type="text" className="input-control" placeholder="Borewell, Canal..." onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })} /></div>
                  </div>
                </>
              )}

              {modalType === 'house' && (
                <>
                  <div className="form-group"><label>House Title</label><input type="text" className="input-control" required onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                  <div className="form-group"><label>Price (₹)</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label>Bedrooms</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })} /></div>
                    <div className="form-group"><label>Bathrooms</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} /></div>
                    <div className="form-group"><label>Built-up sq.ft</label><input type="number" className="input-control" required onChange={(e) => setFormData({ ...formData, builtUpArea: e.target.value })} /></div>
                  </div>
                </>
              )}

              <div className="form-group"><label>Location / Address</label><input type="text" className="input-control" required onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
              <div className="form-group"><label>Description</label><textarea className="input-control" rows={3} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea></div>
              <div className="form-group"><label>Image URLs (comma separated)</label><input type="text" className="input-control" placeholder="https://..., https://..." onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })} /></div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1.5 }}>Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
