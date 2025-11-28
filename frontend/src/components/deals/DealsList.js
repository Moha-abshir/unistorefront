import React, { useEffect, useState } from 'react';
import './DealsList.css';
import api from '../../utils/api';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import WishlistButton from '../Wishlist/WishlistButton';

const DealsList = () => {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let mounted = true;
    
    Promise.all([
      api.get('/deals/active'),
      api.get('/products')
    ])
      .then(([{ data: dealsData }, { data: productsData }]) => {
        if (!mounted) return;
        
        // Sort deals by creation date (newest first) so new deals appear first
        const sortedDeals = dealsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDeals(sortedDeals);
        
        // Extract all product IDs from all deals
        const allProductIds = new Set();
        sortedDeals.forEach(deal => {
          if (deal.productIds && Array.isArray(deal.productIds)) {
            deal.productIds.forEach(id => allProductIds.add(id));
          }
        });
        
        // Filter products that are in deals
        const dealProducts = productsData.filter(p => allProductIds.has(p._id));
        setProducts(dealProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load deals', err);
        if (mounted) {
          setDeals([]);
          setProducts([]);
          setLoading(false);
        }
      });
    
    return () => (mounted = false);
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  if (loading || !deals.length) return null;

  return (
    <div className="deals-list-section">
      {/* Render each deal as a separate horizontal scrollable block */}
      {deals.map((deal) => {
        const dealProducts = products.filter(p => 
          deal.productIds && deal.productIds.includes(p._id)
        );

        if (dealProducts.length === 0) return null;

        return (
          <div key={deal._id} className="deal-block">
            {/* Deal Block Header */}
            <div className="deal-block-header">
              <div className="deal-block-title-info">
                <h3 className="deal-block-title">{deal.title}</h3>
                <p className="deal-block-subtitle">{deal.description || 'Exclusive deals on selected items'}</p>
              </div>
              <a href="#deals" className="see-all-link">See All →</a>
            </div>

            {/* Horizontal Scrollable Products */}
            <div className="deal-block-scroll-container">
              <div className="deal-block-products">
                {dealProducts.map((product) => {
                  // Find the discount for this product
                  const productDeal = deals.find(d => d.productIds && d.productIds.includes(product._id));
                  let discountPercent = 0;
                  let discountedPrice = product.price;

                  if (productDeal) {
                    if (productDeal.discountType === 'percent') {
                      discountPercent = productDeal.discountValue;
                      discountedPrice = product.price - (product.price * productDeal.discountValue / 100);
                    } else if (productDeal.discountType === 'flat') {
                      discountedPrice = product.price - productDeal.discountValue;
                    }
                  }

                  return (
                    <div key={product._id} className="jumia-product-card">
                      <div className="jumia-product-image-container">
                        {discountPercent > 0 && (
                          <span className="jumia-discount-badge">-{Math.round(discountPercent)}%</span>
                        )}
                        <WishlistButton productId={product._id} />
                        <img
                          src={product.image || product.images?.[0]?.url || ''}
                          alt={product.name}
                          className="jumia-product-image"
                        />
                      </div>
                      <div className="jumia-product-info">
                        <h4 className="jumia-product-name">{product.name}</h4>
                        <div className="jumia-product-price">
                          <span className="jumia-current-price">KSh {Math.round(discountedPrice)}</span>
                          {discountPercent > 0 && (
                            <span className="jumia-original-price">KSh {Math.round(product.price)}</span>
                          )}
                        </div>
                        <button
                          className="jumia-add-btn"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealsList;
