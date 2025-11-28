import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminSidebar';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import api from '../../utils/api';

const DashboardPage = () => {
  const [ordersSummary, setOrdersSummary] = useState({
    totalOrders: 0,
    newOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard-data')
      .then(res => {
        setOrdersSummary(res.data);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        api.get('/admin/stats')
          .then(res => {
            setOrdersSummary(res.data);
            setError(null);
          })
          .catch(err => {
            setError(err.response?.data?.message || 'Failed to fetch orders summary');
          })
          .finally(() => setLoading(false));
      });
  }, []);

  return (
    <div className="admin-orders-bg">
      <AdminNavbar />
      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Link to="/admin/product/addproduct" className="admin-btn-primary" style={{ padding: '8px 12px', textDecoration: 'none' }}>+ Add Product</Link>
        </div>
        <h2 className="admin-page-title">Orders Summary</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="orders-grid">
            <div className="order-summary-card">
              <h3>Total Orders</h3>
              <p>{ordersSummary.totalOrders}</p>
            </div>
            <div className="order-summary-card">
              <h3>New Orders</h3>
              <p>{ordersSummary.newOrders}</p>
            </div>
            <div className="order-summary-card">
              <h3>Completed Orders</h3>
              <p>{ordersSummary.completedOrders}</p>
            </div>
            <div className="order-summary-card revenue-card">
              <h3>Total Revenue</h3>
              <p>Ksh {ordersSummary.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
