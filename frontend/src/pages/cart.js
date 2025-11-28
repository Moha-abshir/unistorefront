import React, { useContext } from 'react';

import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (a, c) => a + (Number(c.product?.price) || 0) * (c.qty || 0),
    0
  );

  const handleProceed = () => {
    navigate('/checkout');
  };


  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        🛒 Your cart is empty.<br />
        <button
          style={{
            marginTop: 20,
            background: 'linear-gradient(90deg, #1f4068 0%, #00e0ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onClick={() => navigate('/')}
        >
          ⬅️ Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cartItems.map(({ product, qty }) => (
          <div key={product?._id || Math.random()} className="cart-item">
            <img src={product.image || product.images?.[0]?.url || ''} alt={product?.name || 'Product'} />
            <div className="item-info">
              <h4>{product.name}</h4>
              <p>${(Number(product?.price) || 0).toFixed(2)}</p>
              <div className="qty-control">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={qty}
                  onChange={e => addToCart(product, Number(e.target.value) - qty)}
                />
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
  <h3>Total: ${(Number(totalPrice) || 0).toFixed(2)}</h3>
        <button className="checkout-btn" onClick={handleProceed}>
          Proceed to Checkout
        </button>
        <button
          style={{
            marginTop: 16,
            background: 'linear-gradient(90deg, #1f4068 0%, #00e0ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onClick={() => navigate('/')}
        >
          ⬅️ Back to Home
        </button>
      </div>
    </div>
  );
};

export default CartPage;
