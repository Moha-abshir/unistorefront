import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './Discounts.css';
import AdminNavbar from './AdminSidebar';

export default function DiscountsAdmin() {
  const [discounts, setDiscounts] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [form, setForm] = useState({
    name: '',
    discountType: 'percent',
    amount: 10,
    product: '',
    startsAt: '',
    endsAt: '',
    active: true,
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percent',
    amount: 10,
    minOrderValue: 0,
    maxUses: 0,
    expiresAt: '',
    active: true,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  // Fetch discounts & coupons
  async function fetchAll() {
    try {
      const d = await api.get('/discounts/discounts');
      const c = await api.get('/coupons');
      setDiscounts(d.data);
      setCoupons(c.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
    }
  }

  // Create discount
  async function createDiscount(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        product: form.product && form.product.length === 24 ? form.product : null,
      };
      await api.post('/discounts/discount', payload);
      setForm({ name: '', discountType: 'percent', amount: 10, product: '', startsAt: '', endsAt: '', active: true });
      fetchAll();
    } catch (err) {
      console.error('Discount creation failed:', err.response?.data || err.message);
    }
  }

  // Create coupon
  async function createCoupon(e) {
    e.preventDefault();
    try {
      const payload = {
        ...couponForm,
        expiresAt: couponForm.expiresAt || undefined,
      };
      await api.post('/coupons', payload);
      setCouponForm({ code: '', discountType: 'percent', amount: 10, minOrderValue: 0, maxUses: 0, expiresAt: '', active: true });
      fetchAll();
    } catch (err) {
      console.error('Coupon creation failed:', err.response?.data || err.message);
    }
  }

  // Delete discount
  const handleDeleteDiscount = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;
    try {
      await api.delete(`/discounts/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Delete discount failed:', err.response?.data || err.message);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Delete coupon failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="discounts-admin">
      <AdminNavbar />
      <h1>🎯 Discounts & Coupons Management</h1>

      {/* Discounts Section */}
      <div className="admin-section">
        <h2>💸 Manage Discounts</h2>
        <form className="admin-form" onSubmit={createDiscount}>
          <input placeholder="Discount Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
            <option value="percent">Percent</option>
            <option value="fixed">Fixed</option>
          </select>
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} required />
          <input placeholder="Product ID (optional)" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
          <input type="date" placeholder="Start Date" value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} />
          <input type="date" placeholder="End Date" value={form.endsAt} onChange={e => setForm({ ...form, endsAt: e.target.value })} />
          <button type="submit" className="btn-primary">Add Discount</button>
        </form>

        <h3>🧾 Existing Discounts</h3>
        <div className="card-grid">
          {discounts.map(d => (
            <div className="card" key={d._id}>
              <h4>{d.name}</h4>
              <p><strong>Type:</strong> {d.discountType}</p>
              <p><strong>Amount:</strong> {d.amount}</p>
              <p><strong>Product:</strong> {d.product ? d.product : 'All'}</p>
              <p className={d.active ? 'status-active' : 'status-inactive'}>{d.active ? 'Active' : 'Inactive'}</p>
              <button className="btn-delete" onClick={() => handleDeleteDiscount(d._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Coupons Section */}
      <div className="admin-section">
        <h2>🎟️ Manage Coupons</h2>
        <form className="admin-form" onSubmit={createCoupon}>
          <input placeholder="Coupon Code" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} required />
          <select value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}>
            <option value="percent">Percent</option>
            <option value="fixed">Fixed</option>
          </select>
          <input type="number" placeholder="Amount" value={couponForm.amount} onChange={e => setCouponForm({ ...couponForm, amount: +e.target.value })} required />
          <input type="number" placeholder="Min Order Value" value={couponForm.minOrderValue} onChange={e => setCouponForm({ ...couponForm, minOrderValue: +e.target.value })} />
          <input type="number" placeholder="Max Uses" value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: +e.target.value })} />
          <input type="date" placeholder="Expires At" value={couponForm.expiresAt} onChange={e => setCouponForm({ ...couponForm, expiresAt: e.target.value })} />
          <button type="submit" className="btn-primary">Add Coupon</button>
        </form>

        <h3>🎫 Existing Coupons</h3>
        <div className="card-grid">
          {coupons.map(c => (
            <div className="card" key={c._id}>
              <h4>{c.code}</h4>
              <p><strong>Type:</strong> {c.discountType}</p>
              <p><strong>Amount:</strong> {c.amount}</p>
              <p className={c.active ? 'status-active' : 'status-inactive'}>{c.active ? 'Active' : 'Inactive'}</p>
              <button className="btn-delete" onClick={() => handleDeleteCoupon(c._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
