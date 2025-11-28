import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './FeaturedCarousel.css';

const FeaturedCarousel = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.get('/products', { params: { featured: true, limit: 12 } })
      .then(({ data }) => {
        mounted && setItems(data || []);
      })
      .catch(() => {
        api.get('/products', { params: { limit: 8 } }).then(({ data }) => mounted && setItems(data || []));
      });
    return () => (mounted = false);
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="fc-root">
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          Featured picks loading...
        </div>
      </div>
    );
  }

  // Display only first 4 products
  const displayItems = items.slice(0, 4);

  return (
    <div className="fc-root">
      <div className="fc-head">
        <h3>Featured Picks</h3>
        <button className="fc-see-all" onClick={() => navigate('/products')}>
          See All →
        </button>
      </div>

      <div className="fc-grid">
        {displayItems.map((p) => (
          <a key={p._id} className="fc-item" href={`/product/${p._id}`}>
            <div className="fc-thumb-wrap">
              <img src={p.image || p.images?.[0]?.url} alt={p.name} />
            </div>
            <div className="fc-meta">
              <div className="fc-name">{p.name}</div>
              <div className="fc-price">KES {Number(p.price || 0).toFixed(0)}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
