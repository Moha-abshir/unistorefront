import React, { useState } from "react";

import "./FAQs.css";

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you’ll receive an email with a tracking number and link. You can also track it directly from your account under 'My Orders'.",
  },
  {
    question: "What is the return policy?",
    answer:
      "We accept returns within 7 days of delivery for unworn, unused items with original packaging. Contact support to initiate your return.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Our team is available 24/7. Reach us via WhatsApp, call, or our 'Contact Us' page for quick assistance.",
  },
  {
    question: "Do you deliver outside Nairobi?",
    answer:
      "Yes, we deliver all across Kenya through our trusted delivery partners. Delivery time may vary by location.",
  },
  {
    question: "Can I change my order after placing it?",
    answer:
      "Yes, you can modify your order within 2 hours of placement by contacting our support team.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about shopping with <span className="brand">Manwell Store</span>.</p>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              <span className="faq-icon">{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
