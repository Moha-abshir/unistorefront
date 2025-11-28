import express from "express";
import axios from "axios";

const router = express.Router();

// Pesapal credentials
const consumerKey = process.env.PESAPAL_KEY;
const consumerSecret = process.env.PESAPAL_SECRET;

// Step 1: Get access token
router.get("/get-token", async (req, res) => {
  try {
    const response = await axios.post("https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken", {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Step 2: Submit order request
router.post("/initiate-payment", async (req, res) => {
  try {
    const { amount, description, email, phone } = req.body;
    const token = req.headers["authorization"];

    const payload = {
      amount,
      description,
      currency: "KES",
      callback_url: "https://www.manwellstore.com//payment/callback",
      notification_id: "your-notification-id",
      billing_address: {
        email_address: email,
        phone_number: phone,
        country_code: "KE",
        first_name: "Customer",
        last_name: "User"
      }
    };

    const response = await axios.post(
      "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
