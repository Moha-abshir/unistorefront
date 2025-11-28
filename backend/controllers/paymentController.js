import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "../services/pesapal.js";

const BASE_URL = "https://pay.pesapal.com/v3"; 

export const createPesaPalOrder = async (req, res) => {
  try {
    const token = await getToken();

    const order = {
      id: uuidv4(),
      currency: "KES",
      amount: req.body.amount,
      description: "Ecommerce Purchase",
      callback_url: "https://your-backend.com/api/pesapal/callback",
      notification_id: process.env.PESAPAL_IPN_ID,
      billing_address: {
        email_address: req.body.email,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        phone_number: req.body.phone,
      }
    };

    const response = await axios.post(
      `${BASE_URL}/api/Transactions/SubmitOrderRequest`,
      order,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({
      redirect_url: response.data.redirect_url,
      order_tracking_id: response.data.order_tracking_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PesaPal order creation failed" });
  }
};
