import React from 'react';
import './TrustBadges.css';

const TrustBadges = () => {
  return (
    <div className="trust-root">
      <div className="trust-inner">
        <div className="trust-item">
          <div className="trust-icon">🔒</div>
          <div>Secure Payment</div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">✓</div>
          <div>Trusted Seller</div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">🚚</div>
          <div>Fast Delivery</div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
