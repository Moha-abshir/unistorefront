import React, { useEffect, useState } from 'react';
import './WishlistButton.css';

const WishlistButton = ({ productId }) => {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('mw_wishlist') || '[]');
      setFav(list.includes(productId));
    } catch (e) {
      setFav(false);
    }
  }, [productId]);

  const toggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const list = JSON.parse(localStorage.getItem('mw_wishlist') || '[]');
      let next;
      if (list.includes(productId)) {
        next = list.filter((id) => id !== productId);
        setFav(false);
      } else {
        next = [productId, ...list];
        setFav(true);
      }
      localStorage.setItem('mw_wishlist', JSON.stringify(next));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button className={`wishlist-btn ${fav ? 'active' : ''}`} onClick={toggle} aria-label="Add to wishlist">
      {fav ? '♥' : '♡'}
    </button>
  );
};

export default WishlistButton;
