import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './DiscountedCarousel.css';

const DiscountedCarousel = () => {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/discounted-carousel');
        console.log('Discounted carousel loaded:', data);
        setItems(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load discounted carousel:', err);
        setItems([]);
      }
    };
    load();
  }, []);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (items.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="dc-root">
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No discounted products to display
        </div>
      </div>
    );
  }

  const next = () => setCurrent((current + 1) % items.length);
  const prev = () => setCurrent((current - 1 + items.length) % items.length);
  const goto = (idx) => setCurrent(idx);

  const item = items[current];

  return (
    <div className="dc-root">
      <div className="dc-carousel">
        <button className="dc-nav-btn prev" onClick={prev}>‹</button>
        <a href={`/product/${item._id}`} className="dc-slide">
          <img src={item.image || item.images?.[0]?.url} alt={item.name} />
          <div className="dc-overlay">
            <div className="dc-badge">SALE</div>
            <div className="dc-meta">
              <h3>{item.name}</h3>
              <p className="dc-desc">{item.description?.substring(0, 80)}...</p>
              <div className="dc-prices">
                <span className="new">KES {Number(item.discountedPrice || item.price || 0).toFixed(0)}</span>
                <span className="old">KES {Number(item.price || 0).toFixed(0)}</span>
              </div>
              <a href={`/product/${item._id}`} className="dc-cta">View</a>
            </div>
          </div>
        </a>
        <button className="dc-nav-btn next" onClick={next}>›</button>
      </div>

      <div className="dc-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => goto(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscountedCarousel;
