import express from "express";
import axios from "axios";

const router = express.Router();

// Log Pesapal environment variables
console.log("PESAPAL_BASE_URL:", process.env.PESAPAL_BASE_URL);
console.log("PESAPAL_CONSUMER_KEY:", process.env.PESAPAL_CONSUMER_KEY);
console.log("PESAPAL_CONSUMER_SECRET:", process.env.PESAPAL_CONSUMER_SECRET);
console.log("PESAPAL_CALLBACK_URL:", process.env.PESAPAL_CALLBACK_URL);

// Initiate Pesapal Payment
router.post("/initiate-payment", async (req, res) => {
  try {
    const { amount, email, phone } = req.body;

    // ✅ Get OAuth token (Pesapal requires form-urlencoded)
    const tokenResponse = await axios.post(
      `${process.env.PESAPAL_BASE_URL}/api/Auth/RequestToken`,
      new URLSearchParams({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const token = tokenResponse.data.token;
    console.log("✅ Pesapal Token:", token);

    // ✅ Prepare order request
    const orderRequest = {
      id: Date.now().toString(), // unique order id
      currency: "KES",
      amount: amount,
      description: "E-commerce Order Payment",
      callback_url: process.env.PESAPAL_CALLBACK_URL,
      notification_id: "11111111-1111-1111-1111-111111111111", // replace with your registered IPN ID
      billing_address: {
        email_address: email,
        phone_number: phone,
        country_code: "KE",
        first_name: "Customer",
        last_name: "Order",
        line_1: "Nairobi",
      },
    };

    // ✅ Send order to Pesapal
    const orderResponse = await axios.post(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      orderRequest,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Pesapal Order Response:", orderResponse.data);
    res.json(orderResponse.data);
  } catch (error) {
    console.error("❌ Pesapal Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
});

// Callback URL (Pesapal calls this after payment)
router.post("/callback", (req, res) => {
  console.log("📩 Pesapal Callback Received:", req.body);
  res.json({ message: "Callback received", data: req.body });
});

export default router;
