import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Calendar, MessageSquare, MapPin, XCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bRes, iRes, vRes] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/inquiries/my'),
        api.get('/site-visits/my'),
      ]);
      setBookings(bRes.data);
      setInquiries(iRes.data);
      setSiteVisits(vRes.data);
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setToast('Booking cancelled successfully.');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div className="section-container">
      {/* Profile Header */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#1b4332', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700 }}>
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 style={{ color: '#1b4332', margin: 0 }}>{user?.fullName}</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Email: {user?.email} | Phone: {user?.phone || 'N/A'}</p>
          <span className="badge-status status-approved" style={{ marginTop: '4px' }}>Role: {user?.role}</span>
        </div>
      </div>

      {toast && <div className="alert-success">{toast}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          className="btn-secondary"
          style={{ background: activeTab === 'bookings' ? '#1b4332' : 'transparent', color: activeTab === 'bookings' ? 'white' : '#4b5563', borderRadius: '8px 8px 0 0' }}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={16} inline /> My Vehicle Bookings ({bookings.length})
        </button>

        <button
          className="btn-secondary"
          style={{ background: activeTab === 'inquiries' ? '#1b4332' : 'transparent', color: activeTab === 'inquiries' ? 'white' : '#4b5563', borderRadius: '8px 8px 0 0' }}
          onClick={() => setActiveTab('inquiries')}
        >
          <MessageSquare size={16} inline /> My Inquiries ({inquiries.length})
        </button>

        <button
          className="btn-secondary"
          style={{ background: activeTab === 'visits' ? '#1b4332' : 'transparent', color: activeTab === 'visits' ? 'white' : '#4b5563', borderRadius: '8px 8px 0 0' }}
          onClick={() => setActiveTab('visits')}
        >
          <MapPin size={16} inline /> My Site Visits ({siteVisits.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard details...</div>
      ) : (
        <>
          {activeTab === 'bookings' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Start Date & Time</th>
                    <th>End Date & Time</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No rental bookings found.</td></tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id}>
                        <td>#{b.id}</td>
                        <td><strong>{b.vehicle?.name}</strong><br/><span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{b.vehicle?.location}</span></td>
                        <td>{new Date(b.startDatetime).toLocaleString()}</td>
                        <td>{new Date(b.endDatetime).toLocaleString()}</td>
                        <td style={{ fontWeight: 700, color: '#1b4332' }}>₹{b.totalAmount}</td>
                        <td>
                          <span className={`badge-status status-${b.bookingStatus?.toLowerCase()}`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td>
                          {b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'REJECTED' ? (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              <XCircle size={14} inline /> Cancel
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Listing ID</th>
                    <th>Message</th>
                    <th>Date Sent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No inquiries submitted yet.</td></tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td>#{inq.id}</td>
                        <td><span className="card-badge" style={{ position: 'static' }}>{inq.listingType}</span></td>
                        <td>Listing #{inq.listingId}</td>
                        <td style={{ maxWidth: '300px' }}>{inq.message}</td>
                        <td>{new Date(inq.createdAt).toLocaleString()}</td>
                        <td><span className="badge-status status-approved">{inq.inquiryStatus}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Property Type</th>
                    <th>Listing ID</th>
                    <th>Requested Date & Time</th>
                    <th>Visit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {siteVisits.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No site visit requests found.</td></tr>
                  ) : (
                    siteVisits.map((v) => (
                      <tr key={v.id}>
                        <td>#{v.id}</td>
                        <td><span className="card-badge" style={{ position: 'static', background: '#d4a373' }}>{v.listingType}</span></td>
                        <td>Listing #{v.listingId}</td>
                        <td>{new Date(v.requestedDatetime).toLocaleString()}</td>
                        <td>
                          <span className={`badge-status status-${v.visitStatus?.toLowerCase()}`}>
                            {v.visitStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;
