import React from "react";
import "./Shipping.css";

const Shipping = () => (
  <div className="shipping-container">
    <div className="shipping-content">
      <h1>Shipping & Delivery</h1>
      <p className="intro">
        We’re committed to getting your orders to you quickly, safely, and affordably — wherever you are in the world.
      </p>

      <div className="shipping-section">
        <h2>📦 Standard Shipping</h2>
        <p>
          Our standard delivery typically takes <strong>3–7 business days</strong> depending on your location.
          Once your order is shipped, you’ll receive a confirmation email with tracking details.
        </p>
      </div>

      <div className="shipping-section">
        <h2>⚡ Express Delivery</h2>
        <p>
          Need your items sooner? Choose <strong>Express Shipping</strong> at checkout to receive your package
          within <strong>1–3 business days</strong>. Express delivery fees are calculated based on distance and order weight.
        </p>
      </div>

      <div className="shipping-section">
        <h2>🌍 International Shipping</h2>
        <p>
          We deliver globally! International orders may take between <strong>7–15 business days</strong>.
          Customs duties or import taxes (if applicable) are the responsibility of the customer.
        </p>
      </div>

      <div className="shipping-section">
        <h2>💬 Need Help?</h2>
        <p>
          For any questions or shipping inquiries, feel free to reach out at{" "}
          <a href="mailto:manwellstore@gmail.com">manwellstore@gmail.com</a>.
        </p>
      </div>
    </div>
  </div>
);

export default Shipping;
