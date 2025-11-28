import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import { FaBars, FaTimes, FaHeadset } from 'react-icons/fa';

const adminNavLinks = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Manage Returns', to: '/admin/returns' },
  { label: 'Support Messages', to: '/admin/support', icon: <FaHeadset /> },
  { label: 'Manage Discounts', to: '/admin/discounts' },
  { label: 'Carousel Settings', to: '/admin/discount-carousel' },
];

const AdminNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="admin-navbar-flex">
      <div className="admin-navbar-title">MANWELL</div>

      {/* Desktop links */}
      <ul className="admin-navbar-links-flex desktop-only">
        {adminNavLinks.map(link => (
          <li key={link.label}>
            <Link
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.icon && <span className="nav-icon">{link.icon}</span>}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile toggle */}
      <div className="mobile-only toggle-wrapper">
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {mobileMenuOpen && (
          <ul className="admin-navbar-links-flex mobile-menu">
            {adminNavLinks.map(link => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={location.pathname === link.to ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon && <span className="nav-icon">{link.icon}</span>}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
