import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AdminNavbar from './AdminSidebar';
import './AdminDashboard.css';
import './customers.css';
import styles from './dashboard.module.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/users/customers');
      setCustomers(data);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeactivate = async id => {
    if (!window.confirm('Deactivate this customer?')) return;
    try {
      await api.put(`/users/customers/${id}/deactivate`);
      fetchCustomers();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to deactivate customer');
    }
  };

  const handleActivate = async id => {
    if (!window.confirm('Activate this customer?')) return;
    try {
      await api.put(`/users/customers/${id}/activate`);
      fetchCustomers();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to activate customer');
    }
  };

  const handleVerify = async id => {
    if (!window.confirm('Verify this customer account?')) return;
    try {
      await api.put(`/users/customers/${id}/verify`);
      fetchCustomers();
    } catch (err) {
      alert('Failed to verify customer: ' + (err?.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this customer? This action is irreversible.')) return;
    try {
      await api.delete(`/users/customers/${id}`);
      fetchCustomers();
      setActionError("");
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete customer');
    }
  };

  const handleMakeAdmin = async id => {
    if (!window.confirm('Promote this user to admin? They will have full access.')) return;
    try {
      await api.put(`/users/${id}/make-admin`);
      fetchCustomers();
      setActionError("");
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to promote user to admin');
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'customers.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Customers List', 14, 16);
    autoTable(doc, {
      head: [['Customer ID', 'Name', 'Email', 'Phone', 'Address', 'Total Spent (KES)']],
      body: customers.map(c => [
        c.customerId || c._id,
        c.name,
        c.email,
        c.phone || 'N/A',
        c.address || 'N/A',
        c.totalSpent ? `KES ${(Number(c.totalSpent) || 0).toFixed(2)}` : ''
      ]),
      startY: 22,
    });
    doc.save('customers.pdf');
  };

  const [showUnverified, setShowUnverified] = useState(false);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      (c.customerId || c._id).toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    if (showUnverified) {
      return matchesSearch && !c.isVerified;
    }
    return matchesSearch;
  });

  if (loading) return <div className={styles.loading}>Loading customers...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className="admin-orders-bg">
      <AdminNavbar />
      <main
        className="admin-content"
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', minHeight: '80vh' }}
      >
        {actionError && (
          <div
            style={{
              background: '#ffe6e6',
              color: '#b00020',
              padding: '12px',
              borderRadius: 8,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {actionError}
          </div>
        )}

        <section
          className="customers-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 32,
          }}
        >
          <div>
            <h2 className="admin-page-title" style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>
              Customers
            </h2>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #ccc',
                marginBottom: 12,
                width: 240,
              }}
            />
            <label style={{ display: 'block', marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={showUnverified}
                onChange={e => setShowUnverified(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Show only unverified customers
            </label>

            <div className="order-summary-card-whole">
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Customers</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{customers.length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Registered customers</div>
              </div>
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Active Customers</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>
                  {customers.filter(c => c.isActive).length}
                </div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Active in last 30 days</div>
              </div>
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Blocked</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>
                  {customers.filter(c => !c.isActive).length}
                </div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Blocked customers</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="admin-btn-secondary" onClick={handleDownloadExcel}>
              Download Excel
            </button>
            <button className="admin-btn-secondary" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
        </section>

        <section className="customers-table-section">
          <table className="orders-table" style={{ width: '100%', background: 'transparent', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>
                <th style={{ padding: '12px 8px' }}>Name</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px' }}>Phone</th>
                <th style={{ padding: '12px 8px' }}>Address</th>
                <th style={{ padding: '12px 8px' }}>Role</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Verified</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.address || '—'}</td>
                  <td>
                    <span style={{ 
                      fontWeight: 600, 
                      color: c.role === 'admin' ? '#ffc107' : '#666',
                      textTransform: 'capitalize'
                    }}>
                      {c.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={c.isActive ? styles.statusActive : styles.statusInactive}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={c.isVerified ? styles.statusActive : styles.statusInactive}>
                      {c.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {c.isActive ? (
                        <button
                          className={styles.btnDanger}
                          style={{
                            background: 'linear-gradient(90deg, #ff4c4c 0%, #1f4068 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 18px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                            transition: 'background 0.2s, transform 0.2s',
                          }}
                          onClick={() => handleDeactivate(c._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className={styles.btnPrimary}
                          style={{
                            background: 'linear-gradient(90deg, #5cb85c 0%, #1f4068 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 18px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                            transition: 'background 0.2s, transform 0.2s',
                          }}
                          onClick={() => handleActivate(c._id)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        className={styles.btnDelete}
                        style={{
                          background: 'linear-gradient(90deg, #b00020 0%, #1f4068 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '8px 18px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                          transition: 'background 0.2s, transform 0.2s',
                        }}
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                      {!c.isVerified && (
                        <button
                          className={styles.btnPrimary}
                          style={{
                            background: 'linear-gradient(90deg, #00e0ff 0%, #1f4068 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 18px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                            transition: 'background 0.2s, transform 0.2s',
                          }}
                          onClick={() => handleVerify(c._id)}
                        >
                          Verify
                        </button>
                      )}
                      {c.role !== 'admin' && (
                        <button
                          className={styles.btnPrimary}
                          style={{
                            background: 'linear-gradient(90deg, #ffc107 0%, #1f4068 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 18px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                            transition: 'background 0.2s, transform 0.2s',
                          }}
                          onClick={() => handleMakeAdmin(c._id)}
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminCustomers;
