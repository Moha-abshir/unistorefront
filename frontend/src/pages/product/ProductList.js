import React, { useEffect, useState } from 'react';

import ProductCard from '../../components/product/ProductCard';
import QuickViewModal from '../../components/QuickView/QuickViewModal';
import './ProductList.css';
import api from '../../utils/api';

const ProductList = ({ productIds }) => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/products')
      .then(res => {
        const data = res.data || [];
        if (productIds && productIds.length) {
          const filtered = data.filter(p => productIds.includes(p._id));
          setProducts(filtered);
          setNewProducts([]);
          setFlashSales([]);
          setRecommended([]);
          setTopPicks([]);
        } else {
          setProducts(data);
          setNewProducts(data.filter(p => p.isNew));
          setFlashSales(data.filter(p => p.isFlashSale));
          setRecommended(data.filter(p => p.isRecommended));
          setTopPicks(data.filter(p => p.isTopPick));
        }
      })
      .catch(err => console.error('Failed to load products', err));

    // Listen for quick view event
    const handler = (e) => {
      console.log('mw_open_quickview received in pages ProductList', e.detail && e.detail._id);
      setQuickViewProduct(e.detail);
    };
    window.addEventListener('mw_open_quickview', handler);
    return () => {
      window.removeEventListener('mw_open_quickview', handler);
      mounted = false;
    };
  }, [productIds]);

  if (productIds && productIds.length) {
    return (
      <div className="product-list-page">
        <h2>Linked Products ({products.length})</h2>
        <div className="product-section">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {quickViewProduct && (
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <h2>New Products In</h2>
      <div className="product-section">
        {newProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <h2>Flash Sales</h2>
      <div className="product-section">
        {flashSales.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <h2>Recommended For You</h2>
      <div className="product-section">
        {recommended.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <h2>Top Picks</h2>
      <div className="product-section">
        {topPicks.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <h2>All Products</h2>
      <div className="product-section">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
};

export default ProductList;