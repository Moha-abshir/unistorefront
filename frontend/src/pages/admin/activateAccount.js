import React, { useState } from "react";
import "../pages.css";

const ActivateAccount = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/account/activate/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Account activated!");
        setUserId("");
      } else {
        setMessage(data.message || "Failed to activate account.");
      }
    } catch (error) {
      setMessage("Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Activate Account</h2>
      {message && <p className="form-message">{message}</p>}
      <form className="return-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID to Activate"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Activating..." : "Activate Account"}
        </button>
      </form>
    </div>
  );
};

export default ActivateAccount;
