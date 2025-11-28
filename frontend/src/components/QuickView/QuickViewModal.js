import React from 'react';
import './QuickViewModal.css';

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-card" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose}>×</button>
        <div className="qv-left">
          <img src={product.image || product.images?.[0]?.url} alt={product.name} />
        </div>
        <div className="qv-right">
          <h3>{product.name}</h3>
          <p className="qv-price">KES {Number(product.price || 0).toFixed(2)}</p>
          <p className="qv-desc">{product.description}</p>
          <div className="qv-actions">
            <a href={`/product/${product._id}`} className="qv-btn">View Product</a>
            <a href="/checkout" className="qv-btn ghost">Buy Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
