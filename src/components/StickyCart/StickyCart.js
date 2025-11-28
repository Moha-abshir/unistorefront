import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import './StickyCart.css';

const StickyCart = () => {
  const { cart, total } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cart && cart.length > 0) {
      // make it visible automatically
    }
  }, [cart]);

  return (
    <div className={`sticky-cart ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="sc-surface">
        <div className="sc-head">
          <span className="sc-count">{cart?.length || 0}</span>
          <span className="sc-label">Cart</span>
        </div>
        <div className="sc-total">KES {Number(total || 0).toFixed(2)}</div>
      </div>
      <div className="sc-cta">
        <a href="/cart">View Cart</a>
        <a href="/checkout" className="buy-now">Checkout</a>
      </div>
    </div>
  );
};

export default StickyCart;
