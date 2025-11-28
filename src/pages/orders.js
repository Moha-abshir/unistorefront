import React, { useEffect, useState, useContext } from 'react';
import './Orders.css';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        // Sort orders by date (newest first)
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user)
    return <p className="order-message">⚠️ Please login to view your orders.</p>;
  if (loading)
    return <p className="order-message">⏳ Loading your orders...</p>;
  if (orders.length === 0)
    return <p className="order-message">🛒 You have no orders yet. Start shopping!</p>;

  const getStatusClass = (status) => {
    if (status === 'Delivered') return 'status-delivered';
    if (status === 'Pending') return 'status-pending';
    if (status === 'Cancelled') return 'status-cancelled';
    return 'status-processing';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="orders-header-content">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="order-card"
            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
          >
            {/* Order Header Row */}
            <div className="order-card-header">
              <div className="order-id-section">
                <div className="order-id">Order #{order.orderId}</div>
                <div className="order-date">{formatDate(order.createdAt)}</div>
              </div>
              
              <div className="order-middle">
                <div className="order-item-count">{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</div>
              </div>

              <div className="order-right-section">
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
                <div className="order-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">KES {(Number(order?.totalPrice) || 0).toFixed(0)}</span>
                </div>
              </div>

              <button className="order-expand-btn">
                {expandedOrder === order._id ? '▼' : '▶'}
              </button>
            </div>

            {/* Expanded Products Section */}
            {expandedOrder === order._id && (
              <div className="order-expanded">
                <div className="order-items">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="order-item-detail">
                      <div className="item-image-wrapper">
                        <img 
                          src={item.product?.image || item.product?.images?.[0]?.url || '/placeholder.png'} 
                          alt={item.product?.name || 'Product'} 
                          className="item-image"
                        />
                      </div>
                      <div className="item-info">
                        <h4 className="item-name">{item.product?.name || item.name || 'Product'}</h4>
                        {item.product?.description && (
                          <p className="item-description">{item.product.description}</p>
                        )}
                      </div>
                      <div className="item-qty">
                        <span>Qty</span>
                        <span className="qty-value">{item.qty}</span>
                      </div>
                      <div className="item-price">
                        <span>Price</span>
                        <span className="price-value">KES {(Number(item?.price) || 0).toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>KES {(Number(order?.totalPrice) || 0).toFixed(0)}</span>
                  </div>
                  {order.shippingAddress && (
                    <div className="summary-address">
                      <strong>Shipping Address:</strong>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
