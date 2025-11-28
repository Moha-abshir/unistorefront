import React, { useState } from "react";
import "./Contact.css";
import api from "../utils/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await api.post("/contact", form);
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        We’d love to hear from you. Reach out to us for inquiries, support, or feedback.
      </p>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Our Contact Details</h2>
          <p><strong> Address:</strong> Eastleigh, Nairobi, Kenya</p>
          <p><strong> Phone:</strong> 0794 701 113</p>
          <p><strong> Email:</strong> manwellstore@gmail.com</p>
          <p><strong> Working Hours:</strong> Mon - Sat: 9am - 7pm</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Write your message..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="contact-btn">Send Message</button>

          {status && <p className="contact-status">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
