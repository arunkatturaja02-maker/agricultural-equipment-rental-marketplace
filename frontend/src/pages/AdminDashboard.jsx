import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Tractor, MapPin, Home, Shield, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState({ vehicles: [], lands: [], houses: [] });
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes, lRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/listings'),
      ]);
      setStats(sRes.data);
      setUsers(uRes.data);
      setListings(lRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/users/${id}/status?enabled=${!currentStatus}`);
      setToast(`User account status updated.`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleModerateListing = async (type, id, newStatus) => {
    try {
      await api.patch(`/admin/listings/${type}/${id}/status?status=${newStatus}`);
      setToast(`${type.toUpperCase()} listing status changed to ${newStatus}.`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Moderation failed.');
    }
  };

  return (
    <div className="section-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={28} color="#1b4332" /> Admin Control & Moderation Panel
        </h1>
        <p style={{ color: '#6b7280' }}>Manage platform accounts, moderate listings, and view system metrics.</p>
      </div>

      {toast && <div className="alert-success">{toast}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button className="btn-secondary" style={{ background: activeTab === 'stats' ? '#1b4332' : 'transparent', color: activeTab === 'stats' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('stats')}>
          Overview & Metrics
        </button>
        <button className="btn-secondary" style={{ background: activeTab === 'users' ? '#1b4332' : 'transparent', color: activeTab === 'users' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('users')}>
          User Accounts ({users.length})
        </button>
        <button className="btn-secondary" style={{ background: activeTab === 'listings' ? '#1b4332' : 'transparent', color: activeTab === 'listings' ? 'white' : '#4b5563' }} onClick={() => setActiveTab('listings')}>
          Moderate Listings
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading administration data...</div>
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>TOTAL USERS</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1b4332', marginTop: '4px' }}>{stats.totalUsers}</div>
                <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '4px' }}>Customers: {stats.totalCustomers} | Sellers: {stats.totalSellers}</div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>VEHICLES LISTED</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2d6a4f', marginTop: '4px' }}>{stats.totalVehicles}</div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>FARMLANDS LISTED</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#52b788', marginTop: '4px' }}>{stats.totalLands}</div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>HOUSES LISTED</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d4a373', marginTop: '4px' }}>{stats.totalHouses}</div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>TOTAL BOOKINGS</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>{stats.totalBookings}</div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>TOTAL INQUIRIES</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>{stats.totalInquiries}</div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td><strong>{u.fullName}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td><span className="badge-status status-approved">{u.role}</span></td>
                      <td>
                        <span className={`badge-status status-${u.enabled ? 'active' : 'disabled'}`}>
                          {u.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </td>
                      <td>
                        {u.role !== 'ADMIN' ? (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.enabled)}
                            style={{
                              background: u.enabled ? '#fee2e2' : '#d1fae5',
                              color: u.enabled ? '#991b1b' : '#065f46',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            {u.enabled ? 'Disable Account' : 'Reactivate'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>System Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'listings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.75rem', color: '#1b4332' }}>Vehicles Moderation</h3>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr><th>ID</th><th>Title</th><th>Owner</th><th>Status</th><th>Moderate</th></tr>
                    </thead>
                    <tbody>
                      {listings.vehicles.map((v) => (
                        <tr key={v.id}>
                          <td>#{v.id}</td>
                          <td><strong>{v.name}</strong> ({v.location})</td>
                          <td>{v.owner?.fullName} ({v.owner?.email})</td>
                          <td><span className={`badge-status status-${v.listingStatus?.toLowerCase()}`}>{v.listingStatus}</span></td>
                          <td>
                            {v.listingStatus === 'DISABLED' ? (
                              <button onClick={() => handleModerateListing('vehicle', v.id, 'ACTIVE')} style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Reactivate</button>
                            ) : (
                              <button onClick={() => handleModerateListing('vehicle', v.id, 'DISABLED')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Disable</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '0.75rem', color: '#1b4332' }}>Farmland Moderation</h3>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr><th>ID</th><th>Title</th><th>Seller</th><th>Status</th><th>Moderate</th></tr>
                    </thead>
                    <tbody>
                      {listings.lands.map((l) => (
                        <tr key={l.id}>
                          <td>#{l.id}</td>
                          <td><strong>{l.title}</strong> ({l.district})</td>
                          <td>{l.seller?.fullName}</td>
                          <td><span className={`badge-status status-${l.listingStatus?.toLowerCase()}`}>{l.listingStatus}</span></td>
                          <td>
                            {l.listingStatus === 'DISABLED' ? (
                              <button onClick={() => handleModerateListing('land', l.id, 'ACTIVE')} style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Reactivate</button>
                            ) : (
                              <button onClick={() => handleModerateListing('land', l.id, 'DISABLED')} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Disable</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
