import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./SupportMessages.css";
import AdminNavbar from './AdminSidebar';

const SupportMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get("/contact");
        setMessages(data);
      } catch {
        console.error("Failed to load support messages");
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="support-container">
      <AdminNavbar />
      <h2>Customer Support Messages</h2>

      <table className="support-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg._id}>
              <td data-label="Name">{msg.name}</td>
              <td data-label="Email">{msg.email}</td>
              <td data-label="Subject">{msg.subject}</td>
              <td data-label="Message">{msg.message}</td>
              <td data-label="Date">{new Date(msg.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportMessages;
