import React, { useState, useContext } from "react";
import ShippingAddressForm from "./ShippingAddressForm";
import Payment from "./Payment";
import { CartContext } from "../context/CartContext";
import api from "../utils/api";
import "./checkout.css";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const [shippingData, setShippingData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState({ type: "percent", value: 0 });
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Cart subtotal
  const totalPrice = cartItems.reduce((a, c) => a + c.product.price * c.qty, 0);

  const handleShippingSubmit = (data) => {
    setShippingData(data);
  };

  const handleBackToAddress = () => {
    setShippingData(null);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      setCouponSuccess("");
      setDiscount({ type: "percent", value: 0 });
      return;
    }

    try {
      const res = await api.get(
        `/coupons/validate/${couponCode}?orderValue=${totalPrice}`
      );
      const data = res.data;

      if (data.valid) {
        setDiscount({ type: data.discountType, value: data.amount });
        setCouponSuccess(
          `Coupon applied! You saved ${
            data.discountType === "percent"
              ? `${data.amount}%`
              : `KES ${data.amount}`
          }`
        );
        setCouponError("");
      } else {
        setDiscount({ type: "percent", value: 0 });
        setCouponError(data.message || "Invalid coupon code.");
        setCouponSuccess("");
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setDiscount({ type: "percent", value: 0 });
      setCouponError("invalid coupon code. Try again.");
      setCouponSuccess("");
    }
  };

  return (
    <div className="checkout-container">
      {!shippingData ? (
        <ShippingAddressForm onSubmit={handleShippingSubmit} />
      ) : (
        <div className="payment-step">
          <button className="back-btn" onClick={handleBackToAddress}>
            ← Edit Shipping Address
          </button>

          {/* Coupon Section */}
          <div className="coupon-section">
            <h3>Have a Coupon?</h3>
            <div className="coupon-input-row">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button onClick={handleApplyCoupon} className="apply-btn">
                Apply
              </button>
            </div>
            {couponError && <p className="coupon-error">{couponError}</p>}
            {couponSuccess && <p className="coupon-success">{couponSuccess}</p>}
          </div>

          {/* Payment Section */}
          <Payment
            shippingAddress={shippingData}
            discount={discount}
            totalPrice={totalPrice} // pass subtotal for fixed discount calculations
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
