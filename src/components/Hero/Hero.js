import React from 'react';
import './Hero.css';

const Hero = () => {

  return (
    <div className="hero-root">
      <div className="hero-inner">
        <div className="hero-left">
          <h1 className="hero-head">Discover Your Style</h1>
          <p className="hero-sub">Curated fashion and everyday essentials — delivered fast across Nairobi.</p>
          <div className="hero-ctas">
            <a className="hero-cta" href="/products">Shop New Arrivals</a>
            <a className="hero-cta ghost" href="/collections">Browse Collections</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
