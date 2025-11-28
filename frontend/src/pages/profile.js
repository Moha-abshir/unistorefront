import React, { useContext, useState, useEffect } from 'react';

import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './profile.css';

const sidebarLinks = [
  { label: 'My Account', to: '/profile', icon: '👤' },
  { label: 'Orders', to: '/orders', icon: '🛒' },
];

const ProfilePage = () => {
  const { user, token, logout, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [message, setMessage] = useState('');

  // ✅ Fetch user data from DB (including phone)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: data.country || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Failed to load profile. Please try again.');
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.put('/users/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(data, token);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  if (!user) {
    return <p className="profile-message">Please login to view profile.</p>;
  }

  return (
    <div className="account-layout">
      {/* Sidebar */}
      <aside className="account-sidebar">
        <h3 className="sidebar-title">My Account</h3>
        <ul className="sidebar-nav">
          {sidebarLinks.map((link) => (
            <li key={link.label}>
              <a href={link.to} className="sidebar-link">
                <span>{link.icon}</span> {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={logout} className="sidebar-logout">
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="account-main">
        <h2 className="account-title">Account Overview</h2>
        <div className="account-grid">
          {/* Account Details */}
          <div className="account-card">
            <div className="account-card-header">Account Details</div>
            <div className="account-card-body">
              <form onSubmit={handleSubmit} className="profile-form">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </label>
                <button type="submit" className="update-btn">
                  Update Profile
                </button>
                {message && <p className="status-msg">{message}</p>}
              </form>
            </div>
          </div>

          {/* Address Book */}
          <div className="account-card">
            <div className="account-card-header">
              Address Book <span className="account-edit">✎</span>
            </div>
            <div className="account-card-body">
              {form.address ? (
                <p>
                  {form.address}, {form.city}, {form.country} -{' '}
                  {form.postalCode}
                </p>
              ) : (
                <p>No address added yet.</p>
              )}
            </div>
          </div>

          {/* Store Credit */}
          <div className="account-card">
            <div className="account-card-header">Store Credit</div>
            <div className="account-card-body">
              <p>Balance: KSh 0</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="account-card">
            <div className="account-card-header">Newsletter Preferences</div>
            <div className="account-card-body">
              <p>
                Manage your email communications to stay updated with latest
                news and offers.
              </p>
              <a href="#">Edit Newsletter Preferences</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
