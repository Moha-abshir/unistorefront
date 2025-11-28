import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './FeaturedCategories.css';

const FeaturedCategories = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/products/categories')
      .then(({ data }) => {
        console.log('Categories loaded:', data);
        mounted && setCats(data.slice(0, 6));
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
      });
    return () => (mounted = false);
  }, []);

  if (cats.length === 0) {
    return (
      <div className="featured-cats">
        <span style={{ textAlign: 'center', color: '#999', display: 'block', width: '100%' }}>
          Categories loading...
        </span>
      </div>
    );
  }
  return (
    <div className="featured-cats">
      {cats.map((c) => (
        <a key={c} className="cat-pill" href={`/?category=${encodeURIComponent(c)}`}>{c}</a>
      ))}
    </div>
  );
};

export default FeaturedCategories;
