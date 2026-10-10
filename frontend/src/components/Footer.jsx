import React from 'react';
import { Tractor, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>
            <Tractor color="#52b788" size={24} />
            AgriLand
          </div>
          <p>India's premier marketplace for agricultural vehicle rentals, farmland acquisitions, and rural property sales.</p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><a href="/vehicles">Rent Tractors & Machinery</a></li>
            <li><a href="/lands">Buy Agricultural Land</a></li>
            <li><a href="/houses">Houses & Villas for Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>Support & Helpline</h4>
          <p>Toll Free: 1800-AGRI-LAND</p>
          <p>Email: support@agriland.in</p>
          <p>Location: Punjab, Haryana, All India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AgriLand Marketplace Inc. Built for Indian Farmers & Property Buyers.</p>
      </div>
    </footer>
  );
};

export default Footer;
