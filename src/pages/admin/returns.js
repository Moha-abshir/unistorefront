import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminSidebar';
import './AdminDashboard.css';
import './returns.css';

const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const { data } = await api.get("/returns");
        setReturns(Array.isArray(data) ? data : []);
      } catch (err) {
        setReturns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  if (loading) return <div className="admin-loading">Loading returns...</div>;

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/returns/${id}`, { status });
      setReturns((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-orders-bg">
      <AdminNavbar />
      <main className="admin-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', minHeight: '80vh' }}>
        <section className="returns-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <h2 className="admin-page-title" style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>Returns</h2>
          {/* Add returns summary cards and actions here if needed */}
        </section>
        <section className="returns-table-section">
          {returns.length === 0 ? (
            <div className="admin-error">No return requests found.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Product Name</th>
                    <th>Reason</th>
                    <th>Additional Info</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((ret) => (
                    <tr key={ret._id}>
                      <td>{ret.orderId}</td>
                      <td>{ret.name}</td>
                      <td>{ret.email}</td>
                      <td>{ret.productName}</td>
                      <td>{ret.reason}</td>
                      <td>{ret.additionalInfo || '-'}</td>
                      <td>{new Date(ret.createdAt).toLocaleString()}</td>
                      <td>
                        <span className={`admin-status admin-status-${ret.status}`}>{ret.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {ret.status === 'Pending' ? (
                            <>
                              <button className="admin-btn" onClick={() => handleStatusChange(ret._id, 'Approved')}>Approve</button>
                              <button className="admin-btn" onClick={() => handleStatusChange(ret._id, 'Rejected')}>Reject</button>
                            </>
                          ) : (
                            <span className={ret.status === 'Approved' ? 'admin-status-active' : 'admin-status-inactive'}>{ret.status}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ReturnsPage;
