import React, { useEffect, useState } from 'react';
import './DealCard.css';

function getTimeLeft(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  if (diff <= 0) return 'Expired';
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

const DealCard = ({ deal, onClick }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deal.endDate));

  useEffect(() => {
    if (deal.endDate) {
      const timer = setInterval(() => {
        setTimeLeft(getTimeLeft(deal.endDate));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deal.endDate]);

  return (
    <div className={`deal-card${deal.active ? ' active' : ''}`} onClick={() => onClick(deal)}>
      <div className="deal-banner">
        <img src={deal.bannerImage} alt={deal.title} />
      </div>
      <div className="deal-info">
        <div className="deal-title">{deal.title}</div>
        <div className="deal-badge">{deal.discountType === 'percent' ? `${deal.discountValue}% OFF` : `KES ${deal.discountValue} OFF`}</div>
        <div className="deal-desc">{deal.description}</div>
        <div className="deal-timer">{timeLeft}</div>
      </div>
    </div>
  );
};

export default DealCard;
