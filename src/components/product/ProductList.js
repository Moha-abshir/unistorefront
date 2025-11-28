import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import ProductCard from './ProductCard';
import QuickViewModal from '../QuickView/QuickViewModal';
import './ProductList.css';

const ProductList = ({ isHomepage = true }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = isHomepage
          ? { limit: 8, sort: '-createdAt' }
          : { keyword, category };
        console.log('ProductList fetching with params:', params, 'isHomepage:', isHomepage);
        const { data } = await api.get('/products', { params });
        console.log('ProductList loaded:', data);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [isHomepage, keyword, category]);

  useEffect(() => {
    const handler = (e) => {
      console.log('mw_open_quickview received in components ProductList', e.detail && e.detail._id);
      setSelectedProduct(e.detail);
    };
    window.addEventListener('mw_open_quickview', handler);
    return () => window.removeEventListener('mw_open_quickview', handler);
  }, []);

  return (
    <div className="product-list-container">
      {/* 🔍 Search and Filter - Hidden on homepage */}
      {!isHomepage && (
        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🛍 Products Grid */}
      <div className="products-grid">
        {loading ? (
          // show skeletons while loading
          Array.from({ length: 8 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-image" />
              <div className="skeleton-body">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line tiny" />
              </div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              // pass discount info (if available)
              discountPercent={product.discountPercent}
              discountedPrice={product.discountedPrice}
            />
          ))
        ) : (
          <p className="no-products">No products found 🚫</p>
        )}
      </div>
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      {isHomepage && (
        <div className="see-all-wrap">
          <a href="/products" className="see-all-btn">View All Products →</a>
        </div>
      )}
    </div>
  );
};

export default ProductList;
