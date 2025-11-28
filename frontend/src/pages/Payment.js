import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../utils/api";
import "./Payment.css";

const Payment = ({ shippingAddress, discount = { type: null, value: 0 }, couponCode = null }) => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("Pay on Delivery");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPaymentIcon = (method) => {
    switch (method) {
      case "Mpesa":
        return "📱";
      case "Pay on Delivery":
        return "🚚";
      case "Card":
        return "💳";
      default:
        return "💰";
    }
  };

  // Cart subtotal
  const totalPrice = cartItems.reduce((a, c) => a + c.product.price * c.qty, 0);

  // Compute discount amount
  const discountAmount =
    discount.type === "percent"
      ? (totalPrice * discount.value) / 100
      : discount.type === "fixed"
      ? discount.value
      : 0;

  const finalAmount = totalPrice - discountAmount;

  // Validate Kenyan phone number
  const validatePhone = (num) => /^(07|01)\d{8}$/.test(num);

  const handlePayment = async () => {
    if (!cartItems.length) {
      setMessage("⚠️ No items in cart");
      return;
    }

    if (paymentMethod === "Mpesa" && !validatePhone(phone)) {
      setMessage("⚠️ Please enter a valid M-PESA number (07XXXXXXXX or 01XXXXXXXX)");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const orderPayload = {
        orderItems: cartItems.map((i) => ({
          product: i.product._id,
          qty: i.qty,
        })),
        shippingAddress,
        paymentMethod,
        totalPrice,
        discount: discount,
        couponCode: couponCode,
        finalAmount,
        phone: paymentMethod === "Mpesa" ? phone : undefined,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ Please login to continue");
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post("/orders", orderPayload, config);

      if (paymentMethod === "Mpesa") {
        setMessage("📲 Sending M-PESA STK push...");

        const stkResponse = await fetch(
          "https://manwellback.onrender.com/api/mpesa/stkpush",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: phone.startsWith("254") ? phone : `254${phone.slice(-9)}`,
              amount: finalAmount,
            }),
          }
        );

        const data = await stkResponse.json();

        if (stkResponse.ok && data.success) {
          setMessage("✅ STK Push sent! Check your M-PESA phone to complete payment.");
        } else {
          setMessage(
            data?.error?.errorMessage ||
              data?.message ||
              "❌ Failed to initiate M-PESA payment."
          );
        }
      } else {
        setMessage("✅ Order placed successfully (Pay on Delivery).");
      }

      clearCart();
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error("Payment error:", err);
      setMessage(`❌ ${err.response?.data?.message || "Payment failed. Try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>

      <div className="address-box">
        <p>
          Deliver to: <strong>{shippingAddress.fullName}</strong> <br />
          {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.county || shippingAddress.country}
        </p>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <p>Subtotal: <strong>KES {totalPrice.toFixed(2)}</strong></p>
        {discount.value > 0 && (
          <p>
            Discount ({discount.type === "percent" ? `${discount.value}%` : `KES ${discount.value}`}):
            <strong> -KES {discountAmount.toFixed(2)}</strong>
          </p>
        )}
        <p className="total-pay">
          Total Payable: <strong>KES {finalAmount.toFixed(2)}</strong>
        </p>
      </div>

      <div className="payment-options">
        <label className="option">
          <div className="option-icon">{getPaymentIcon("Pay on Delivery")}</div>
          <input
            type="radio"
            name="paymentMethod"
            value="Pay on Delivery"
            checked={paymentMethod === "Pay on Delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="option-label">Pay on Delivery</span>
        </label>
      </div>

      {paymentMethod === "Mpesa" && (
        <div className="mpesa-input-box" style={{ display: "none" }}>
          <label>Enter M-PESA Number</label>
          <input
            type="tel"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
          />
        </div>
      )}

      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading
          ? "Processing..."
          : paymentMethod === "Pay on Delivery"
          ? "Place Order"
          : "Pay Now"}
      </button>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default Payment;
