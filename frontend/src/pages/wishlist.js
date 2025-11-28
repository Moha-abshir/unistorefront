import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './wishlist.css';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      const ids = JSON.parse(localStorage.getItem('mw_wishlist') || '[]');
      if (ids.length === 0) {
        setItems([]);
        return;
      }

      try {
        const { data } = await api.get('/products', { params: { ids: ids.join(',') } });
        setItems(data);
      } catch (err) {
        const proms = ids.map((id) => api.get(`/products/${id}`).then(r => r.data).catch(() => null));
        const results = await Promise.all(proms);
        setItems(results.filter(Boolean));
      }
    };

    load();
  }, [user, token]);

  const remove = (id) => {
    const next = (JSON.parse(localStorage.getItem('mw_wishlist') || '[]')).filter(i => i !== id);
    localStorage.setItem('mw_wishlist', JSON.stringify(next));
    setItems(items.filter(i => i._id !== id));

    if (token) {
      api.delete(`/users/wishlist/${id}`).catch(() => {});
    }
  };

  return (
    <div className="wishlist-page">
      <div className="page-inner">
        <h2>Your Wishlist</h2>
        {items.length === 0 ? (
          <p>No items in your wishlist yet.</p>
        ) : (
          <div className="wishlist-grid">
            {items.map(p => (
              <div className="wl-item" key={p._id}>
                <a href={`/product/${p._id}`}>
                  <img src={p.image || p.images?.[0]?.url} alt={p.name} />
                </a>
                <div className="wl-meta">
                  <a href={`/product/${p._id}`} className="wl-name">{p.name}</a>
                  <div className="wl-price">KES {Number(p.price||0).toFixed(2)}</div>
                  <div style={{marginTop:8}}>
                    <button className="wl-remove" onClick={() => remove(p._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
