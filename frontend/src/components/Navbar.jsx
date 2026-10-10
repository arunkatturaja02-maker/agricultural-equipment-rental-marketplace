import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, Home, MapPin, Building2, Calendar, List, Shield, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Tractor size={28} color="#52b788" />
        <span>AgriLand</span>
      </Link>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/vehicles" className={({ isActive }) => (isActive ? 'active' : '')}>
            Rent Vehicles
          </NavLink>
        </li>
        <li>
          <NavLink to="/lands" className={({ isActive }) => (isActive ? 'active' : '')}>
            Agricultural Lands
          </NavLink>
        </li>
        <li>
          <NavLink to="/houses" className={({ isActive }) => (isActive ? 'active' : '')}>
            Houses for Sale
          </NavLink>
        </li>

        {isLoggedIn && (
          <>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                My Bookings
              </NavLink>
            </li>
            {(user?.role === 'SELLER' || user?.role === 'ADMIN') && (
              <li>
                <NavLink to="/seller" className={({ isActive }) => (isActive ? 'active' : '')}>
                  My Listings
                </NavLink>
              </li>
            )}
            {user?.role === 'ADMIN' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Admin
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>

      <div className="nav-user">
        {isLoggedIn ? (
          <>
            <span className="user-badge">
              {user?.fullName} ({user?.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', width: 'auto' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
