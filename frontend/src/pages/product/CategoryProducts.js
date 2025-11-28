import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import './ProductList.css';
import api from '../../utils/api';

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?category=${encodeURIComponent(category)}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="product-list-page">
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-section">
          {products.length === 0 ? (
            <div>No products found in this category.</div>
          ) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
