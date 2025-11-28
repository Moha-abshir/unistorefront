import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./pages.css";

const ActivateAccount = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [location.search]);

  // Step 1: Request activation email
  const handleSendActivation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://manwellback.onrender.com/api/account/send-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Activation email sent! Check your inbox.");
      } else {
        setMessage(data.message || "Failed to send activation email.");
      }
    } catch (error) {
      setMessage("Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Activate account via token
  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://manwellback.onrender.com/api/account/activate-by-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Account activated successfully!");
        setToken("");
        setEmail("");
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
      {!token ? (
        <form className="return-form" onSubmit={handleSendActivation}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Activation Email"}
          </button>
        </form>
      ) : (
        <form className="return-form" onSubmit={handleActivate}>
          <input
            type="text"
            placeholder="Activation Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Activating..." : "Activate Account"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ActivateAccount;
