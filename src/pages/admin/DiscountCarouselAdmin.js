import React, { useEffect, useState, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import './DiscountCarouselAdmin.css';

const DiscountCarouselAdmin = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 100 } });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/discounted-carousel');
        setSelected(data.map(p => p._id));
      } catch (err) {
        console.error('Failed to load current carousel:', err);
      }
    };
    load();
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id] // no cap (unlimited)
    );
  };

  const save = async () => {
    try {
      await api.post('/admin/discounted-carousel', { productIds: selected });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save carousel:', err);
    }
  };

  if (!user || user.role !== 'admin') {
    return <p>Admin access required.</p>;
  }

  return (
    <div className="dca-page">
      <h2>Manage Discounted Carousel</h2>
      <p className="dca-note">Select products to display on the homepage carousel:</p>

      <div className="dca-grid">
        {products.map(p => (
          <div
            key={p._id}
            className={`dca-item ${selected.includes(p._id) ? 'selected' : ''}`}
            onClick={() => toggle(p._id)}
          >
            <img src={p.image || p.images?.[0]?.url} alt={p.name} />
            <div className="dca-name">{p.name}</div>
            <div className="dca-price">KES {Number(p.price || 0).toFixed(0)}</div>
            <div className="dca-check">{selected.includes(p._id) ? '✓' : ''}</div>
          </div>
        ))}
      </div>

      <div className="dca-actions">
        <button onClick={save} className="save-btn">Save Carousel ({selected.length})</button>
        {saved && <span className="dca-success">✓ Saved!</span>}
      </div>
    </div>
  );
};

export default DiscountCarouselAdmin;
