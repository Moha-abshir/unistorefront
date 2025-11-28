import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import AdminNavbar from './AdminSidebar';
import './AdminDashboard.css';
import './orders.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'orders.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Orders List', 14, 16);
    autoTable(doc, {
      head: [['Order ID', 'Customer', 'Status', 'Total (KES)']],
      body: orders.map(o => [
        o.orderId || o._id,
        o.user?.name || 'N/A',
        o.status,
        `KES ${(Number(o?.totalPrice) || 0).toFixed(2)}`
      ]),
      startY: 22,
    });
    doc.save('orders.pdf');
  };

  function getStatusColor(status) {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Processing': return '#2196f3';
      case 'Shipped': return '#673ab7';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#222';
    }
  }

  const filteredOrders = orders.filter(o =>
    (o.orderId || o._id).toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading orders...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-orders-bg">
      <AdminNavbar />
      <main className="admin-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', minHeight: '80vh' }}>
        {/* Header */}
        <section className="orders-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h2 className="admin-page-title" style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>Orders List</h2>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 12, width: 240 }}
            />
            <div className="order-summary-card-whole">
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Orders</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{orders.length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Total Orders last 365 days</div>
              </div>
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>New Orders</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{orders.filter(o => o.status === 'Pending').length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>New Orders last 365 days</div>
              </div>
              <div className="order-summary-card">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Completed Orders</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>{orders.filter(o => o.status === 'Delivered').length}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Completed Order last 365 days</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="admin-btn-secondary" onClick={handleDownloadExcel}>Download Excel</button>
            <button className="admin-btn-secondary" onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </section>

        {/* Orders Table */}
        <section className="orders-table-section">
          <table className="orders-table" style={{ width: '100%', background: 'transparent', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>
                <th style={{ padding: '12px 8px' }}>Order ID</th>
                <th style={{ padding: '12px 8px' }}>Customer</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Total</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId}</td>
                  <td>{o.user?.name || 'N/A'}</td>
                  <td>
                    <span className={`admin-status admin-status-${o.status}`}
                      style={{ color: getStatusColor(o.status), background: '#f5f5f5', padding: '4px 12px', borderRadius: 8, fontWeight: 600 }}>
                      {o.status}
                    </span>
                  </td>
                  <td>KES {(Number(o?.totalPrice) || 0).toFixed(2)}</td>
                  <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      className="admin-select"
                      value={o.status}
                      onChange={e => handleStatusChange(o._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>

                    {/* View Button */}
                    <Link to={`/admin/orders/${o._id}`}>
                      <button className="admin-btn-primary">View</button>
                    </Link>
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

export default AdminOrders;
