import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'CUSTOMER', // Restricted to CUSTOMER or SELLER
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!formData.terms) {
      setError('Please accept the Terms and Conditions to proceed.');
      return;
    }

    if (formData.role === 'ADMIN') {
      setError('Admin registration is not allowed.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: formData.address,
        role: formData.role,
      });
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (!err.response) {
        setError('Cannot connect to backend server. Please make sure the backend is running on port 8085.');
      } else {
        setError('Registration failed. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '3rem 1rem' }}>
      <div className="auth-card" style={{ maxWidth: '550px' }}>
        <div className="auth-header">
          <div className="auth-brand">
            <Tractor size={36} color="#52b788" />
            <span>AgriLand</span>
          </div>
          <p className="auth-subtitle">Create an account to rent machinery or buy/sell land & property.</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              className="input-control"
              placeholder="e.g. Ramesh Kumar"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="input-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="input-control"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input-control"
                  placeholder="At least 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="input-control"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address / Village / District</label>
            <input
              type="text"
              name="address"
              className="input-control"
              placeholder="Full address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <select
              name="role"
              className="input-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="CUSTOMER">Customer (Rent Vehicles / Buy Property)</option>
              <option value="SELLER">Seller / Vehicle Owner (List Vehicles, Lands, Houses)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              I agree to the AgriLand Terms & Conditions and Privacy Policy
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#2d6a4f', fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
