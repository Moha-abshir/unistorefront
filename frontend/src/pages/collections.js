import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import './collections.css';

const CollectionsPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    load();
  }, []);

  return (
    <div className="collections-page">
      <h2>Shop by Collection</h2>
      <p className="collections-subtitle">Browse our curated collections of fashion and essentials.</p>

      <div className="collections-grid">
        {categories.map((cat) => (
          <Link key={cat} to={`/category/${cat}`} className="collection-card">
            <div className="collection-thumb">
              <span className="collection-label">{cat}</span>
            </div>
            <div className="collection-overlay">
              <span>Explore {cat}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
