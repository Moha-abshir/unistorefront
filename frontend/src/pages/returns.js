import React, { useState } from "react";

import "./pages.css";


const ReturnsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    productName: "",
    reason: "",
    additionalInfo: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // For status check
  const [statusEmail, setStatusEmail] = useState("");
  const [statusOrderId, setStatusOrderId] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://manwellback.onrender.com/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("✅ Your return request has been submitted successfully!");
        setFormData({
          name: "",
          email: "",
          orderId: "",
          productName: "",
          reason: "",
          additionalInfo: "",
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage(
          `❌ Failed to submit request. ${errorData.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status check
  const handleStatusCheck = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    setStatusResult(null);
    try {
      const res = await fetch(
        `https://manwellback.onrender.com/api/returns/status?email=${encodeURIComponent(statusEmail)}&orderId=${encodeURIComponent(statusOrderId)}`
      );
      if (res.ok) {
        const found = await res.json();
        setStatusResult(found);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setStatusResult(errorData.message || "Unable to fetch return status. Please try again later.");
      }
    } catch (error) {
      setStatusResult("Error checking status. Please try again later.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Return a Product</h2>
      <p>
        Fill out the form below to request a return. Our support team will
        contact you within <strong>48 hours</strong>.
      </p>
      {message && <p className="form-message">{message}</p>}
      <form className="return-form flex-row-form" onSubmit={handleSubmit}>
        <div className="form-flex-group">
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-flex-group">
          <input
            type="text"
            name="orderId"
            placeholder="Order ID"
            value={formData.orderId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-flex-group">
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          >
            <option value="">Select Reason</option>
            <option value="Damaged">Damaged Product</option>
            <option value="Defective">Defective Item</option>
            <option value="Wrong Item">Wrong Item Delivered</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="additionalInfo"
            placeholder="Additional Information (optional)"
            value={formData.additionalInfo}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Return Request"}
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />
      <h3>Check Your Return Status</h3>
      <form className="return-status-form" onSubmit={handleStatusCheck}>
        <input
          type="email"
          placeholder="Your Email Address"
          value={statusEmail}
          onChange={(e) => setStatusEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Order ID"
          value={statusOrderId}
          onChange={(e) => setStatusOrderId(e.target.value)}
          required
        />
        <button type="submit" disabled={statusLoading}>
          {statusLoading ? "Checking..." : "Check Status"}
        </button>
      </form>
      {statusResult && (
        typeof statusResult === "string" ? (
          <p className="form-message">{statusResult}</p>
        ) : (
          <div className="return-status-result">
            <p>
              <strong>Status:</strong> {statusResult.status}
            </p>
            <p>
              <strong>Product:</strong> {statusResult.productName}
            </p>
            <p>
              <strong>Reason:</strong> {statusResult.reason}
            </p>
            <p>
              <strong>Submitted:</strong> {new Date(statusResult.createdAt).toLocaleString()}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ReturnsPage;
