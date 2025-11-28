
import React from 'react';
import cache from '../utils/cache';

const ClearCacheButton = () => {
  const handleClick = () => {
    cache.clear();
    alert('Cache cleared successfully!');
  };

  return (
    <button onClick={handleClick} className="btn btn-danger">
      Clear Cache
    </button>
  );
};

export default ClearCacheButton;
