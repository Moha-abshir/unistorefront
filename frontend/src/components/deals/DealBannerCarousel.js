import React, { useEffect, useState, useRef } from 'react';
import './DealBannerCarousel.css';
import api from '../../utils/api';

const DealBannerCarousel = () => {
  const [deals, setDeals] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    api.get('/deals/active')
      .then(({ data }) => setDeals(data))
      .catch(err => { console.error('Failed to load deal banners', err); setDeals([]); });
  }, []);

  useEffect(() => {
    if (deals.length > 1) {
      timerRef.current = setInterval(() => {
        setIndex(i => (i + 1) % deals.length);
      }, 6000);
      return () => clearInterval(timerRef.current);
    }
  }, [deals]);

  if (!deals.length) return null;

  const currentDeal = deals[index];

  return (
    <div className="deal-banner-header">
      <div className="deal-banner-left">
        <h2 className="deal-banner-title">{currentDeal.title}</h2>
        <p className="deal-banner-subtitle">{currentDeal.description || 'Exclusive deals on selected items'}</p>
      </div>
    </div>
  );
};

export default DealBannerCarousel;
