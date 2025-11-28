import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AdminNavbar from './AdminSidebar';
import DealForm from '../../components/deals/DealForm';
import './AdminDashboard.css';
import './deals.css';
import styles from './dashboard.module.css';

const AdminDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDeal, setEditingDeal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchDeals = async () => {
    try {
      const { data } = await api.get('/deals');
      setDeals(data);
    } catch (err) {
      setError('Failed to load deals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this deal? This action is irreversible.')) return;
    try {
      await api.delete(`/deals/${id}`);
      fetchDeals();
      setActionError("");
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete deal');
    }
  };

  const handleSaveDeal = async (savedDeal) => {
    fetchDeals();
    setShowForm(false);
    setEditingDeal(null);
  };

  const handleToggleActive = async id => {
    try {
      const deal = deals.find(d => d._id === id);
      if (!deal) return;
      await api.put(`/deals/${id}`, { ...deal, active: !deal.active });
      fetchDeals();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to toggle deal');
    }
  };

  if (loading) return <div className={styles.loading}>Loading deals...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className="admin-orders-bg">
      <AdminNavbar />
      <main className="admin-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', minHeight: '80vh' }}>
        {actionError && (
          <div style={{
            background: '#ffe6e6',
            color: '#b00020',
            padding: '12px',
            borderRadius: 8,
            marginBottom: 16,
            fontWeight: 600,
          }}>
            {actionError}
          </div>
        )}

        <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 className="admin-page-title">Manage Deals</h2>
          <button
            className="admin-btn-primary"
            onClick={() => {
              setEditingDeal(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ New Deal'}
          </button>
        </section>

        {showForm && (
          <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 12, marginBottom: 32 }}>
            <DealForm deal={editingDeal} onSave={handleSaveDeal} />
          </div>
        )}

        <section className="deals-table-section">
          <table className="orders-table" style={{ width: '100%', background: 'transparent', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>
                <th style={{ padding: '12px 8px' }}>Title</th>
                <th style={{ padding: '12px 8px' }}>Discount</th>
                <th style={{ padding: '12px 8px' }}>Products</th>
                <th style={{ padding: '12px 8px' }}>Start Date</th>
                <th style={{ padding: '12px 8px' }}>End Date</th>
                <th style={{ padding: '12px 8px' }}>Active</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal._id}>
                  <td style={{ fontWeight: 600 }}>{deal.title}</td>
                  <td>
                    {deal.discountType === 'percent' ? `${deal.discountValue}%` : `KES ${deal.discountValue}`}
                  </td>
                  <td>{deal.productIds?.length || 0}</td>
                  <td>{new Date(deal.startDate).toLocaleDateString()}</td>
                  <td>{new Date(deal.endDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 6,
                      background: deal.active ? '#c8e6c9' : '#ffcccc',
                      color: deal.active ? '#2e7d32' : '#c62828',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {deal.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        className={styles.btnPrimary}
                        style={{
                          background: deal.active ? 'linear-gradient(90deg, #ff9800 0%, #1f4068 100%)' : 'linear-gradient(90deg, #4caf50 0%, #1f4068 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        onClick={() => handleToggleActive(deal._id)}
                      >
                        {deal.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className={styles.btnPrimary}
                        style={{
                          background: 'linear-gradient(90deg, #2196f3 0%, #1f4068 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        onClick={() => {
                          setEditingDeal(deal);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.btnDelete}
                        style={{
                          background: 'linear-gradient(90deg, #b00020 0%, #1f4068 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        onClick={() => handleDelete(deal._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {deals.length === 0 && (
            <p style={{ textAlign: 'center', padding: 24, color: '#888' }}>No deals yet. Create one to get started!</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDeals;
